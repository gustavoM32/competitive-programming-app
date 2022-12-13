package com.gustavo.competitiveprogrammingapp.information.processors

import com.gustavo.competitiveprogrammingapp.information.InformationService
import com.gustavo.competitiveprogrammingapp.information.ProblemId
import com.gustavo.competitiveprogrammingapp.information.UpdateResponse
import com.gustavo.competitiveprogrammingapp.information.domain.*
import com.gustavo.competitiveprogrammingapp.information.repositories.UserContestStatusRepository
import com.gustavo.competitiveprogrammingapp.information.repositories.UserProblemStatusRepository
import com.gustavo.competitiveprogrammingapp.rest.problem.ProblemStatusEnum
import com.gustavo.competitiveprogrammingapp.util.Timer
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@Component
class UserStatusProcessor(
    private val userProblemStatusRepository: UserProblemStatusRepository,
    private val userContestStatusRepository: UserContestStatusRepository,
    private val informationService: InformationService,
    private val problemMappingProcessor: ProblemMappingProcessor,
    private val cfProblemProcessor: CfProblemProcessor,
    private val cfContestProcessor: CfContestProcessor,
    private val contestProblemProcessor: ContestProblemProcessor,
    private val userSubmissionsProcessor: UserSubmissionsProcessor
) {
    companion object {
        const val INFORMATION_ID = "UserStatus"
        private val isUpdatingSet = mutableSetOf<String>()
    }

    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    fun update(user: String): UpdateResponse {
        if (isUpdating(user)) return UpdateResponse(false, informationService.getLastUpdate(getId(user)))
        val shouldUpdate: Boolean

        try {
            isUpdatingSet.add(user)
            val lastUpdate = informationService.getLastUpdate(getId(user))

            shouldUpdate = (lastUpdate < cfProblemProcessor.update().lastUpdate)
                .or(lastUpdate < cfContestProcessor.update().lastUpdate)
                .or(lastUpdate < contestProblemProcessor.update().lastUpdate)
                .or(lastUpdate < cfContestProcessor.update().lastUpdate)
                .or(lastUpdate < userSubmissionsProcessor.update(user).lastUpdate)

            if (shouldUpdate) {
                process(user)
                informationService.update(getId(user))
            }
        } finally {
            isUpdatingSet.remove(user)
        }

        return UpdateResponse(shouldUpdate, informationService.getLastUpdate(getId(user)))
    }

    fun isUpdating(user: String): Boolean {
        return isUpdatingSet.contains(user)
    }

    fun process(user: String) {
        logger.info("UserStatusProcessor update start...")
        val timer = Timer("Problemset update")

        // get dependent data
        val cfProblems = cfProblemProcessor.get()
        val cfContests = cfContestProcessor.get()
        val contestProblems = contestProblemProcessor.get() // FIXME: STOP USING THIS
        val problemMappingList = problemMappingProcessor.get() // FIXME: STOP USING THIS
        val userSubmissions = userSubmissionsProcessor.get(user)
        timer.check("Got dependent data")

        // process it
        val problemMapping = problemMappingList.associateBy({ it.contestProblemId }, { it.problemsetProblemId })
        timer.check("Processed problemMapping")

        // get problems status from user submissions, with the mapping
        val problemStatusMap = getProblemStatusMap(problemMapping, userSubmissions)
        timer.check("problemStatusMap calculated")

        // get contest status from its problems
        val contestStatusMap = getContestStatusMap(contestProblems, problemMapping, problemStatusMap)
        timer.check("contestStatusMap calculated")

        val userProblemStatus = cfProblems.map { p ->
            com.gustavo.competitiveprogrammingapp.information.domain.ProblemStatus(
                problemId = p.problemId,
                problemStatus = problemStatusMap.getOrDefault(p.problemId, ProblemStatusEnum.NOTHING),
                contestStatus = contestStatusMap.getOrDefault(p.problemId.contestId, ContestStatusEnum.CLEAN)
            )
        }
        timer.check("userProblemStatus calculated")

        val userContestStatus = cfContests.map { c ->
            ContestStatus(
                id = c.id,
                contestStatus = contestStatusMap.getOrDefault(c.id, ContestStatusEnum.CLEAN)
            )
        }
        timer.check("userContestStatus calculated")

        // save information
        userProblemStatusRepository.save(UserProblemStatus(user, userProblemStatus))
        userContestStatusRepository.save(UserContestStatus(user, userContestStatus))

        timer.check("problem and contest status saved")
        logger.info("UserStatusProcessor update completed.")
    }

    fun getProblemStatus(user: String): List<ProblemStatus> {
        return userProblemStatusRepository.findById(user).map { it.problemsStatus }.orElse(emptyList())
    }

    fun getContestStatus(user: String): List<ContestStatus> {
        return userContestStatusRepository.findById(user).map { it.contestsStatus }.orElse(emptyList())
    }

    fun reset() {
        userProblemStatusRepository.deleteAll()
        userContestStatusRepository.deleteAll()
        // TODO: Find a way to delete from the information repository.
    }

    private fun getId(user: String): String {
        return "$INFORMATION_ID/$user"
    }

    private fun getProblemStatusMap(
        problemMapping: Map<ProblemId, ProblemId>,
        userStatus: List<CfSubmission>
    ): Map<ProblemId, ProblemStatusEnum> {
        val problemStatusMap = mutableMapOf<ProblemId, ProblemStatusEnum>()

        userStatus.forEach a@{
            val mappedTo = problemMapping.getOrDefault(it.problemId, it.problemId)

            if (it.verdict == "OK") problemStatusMap[mappedTo] = ProblemStatusEnum.AC
            else if (problemStatusMap.getOrDefault(mappedTo, ProblemStatusEnum.NOTHING) != ProblemStatusEnum.AC)
                problemStatusMap[mappedTo] = ProblemStatusEnum.WA
        }
        return problemStatusMap
    }

    private fun getContestStatusMap(
        contestProblems: List<ContestProblem>,
        problemMapping: Map<ProblemId, ProblemId>,
        problemStatusMap: Map<ProblemId, ProblemStatusEnum>
    ): Map<Int, ContestStatusEnum> {
        val contestStatusMap = mutableMapOf<Int, ContestStatusEnum>()

        contestProblems.forEach a@{
            val contestId = it.problemId.contestId

            val mappedTo = problemMapping.getOrDefault(it.problemId, it.problemId)
            val problemStatus = problemStatusMap.getOrDefault(mappedTo, ProblemStatusEnum.NOTHING)

            if (!contestStatusMap.containsKey(contestId)) {
                contestStatusMap[contestId] = when (problemStatus) {
                    ProblemStatusEnum.NOTHING -> ContestStatusEnum.CLEAN
                    ProblemStatusEnum.AC -> ContestStatusEnum.COMPLETED
                    else -> ContestStatusEnum.DIRTY
                }
            } else if (!(contestStatusMap[contestId] == ContestStatusEnum.CLEAN && problemStatus == ProblemStatusEnum.NOTHING ||
                        contestStatusMap[contestId] == ContestStatusEnum.COMPLETED && problemStatus == ProblemStatusEnum.AC)
            ) {
                contestStatusMap[contestId] = ContestStatusEnum.DIRTY
            }
        }

        return contestStatusMap
    }
}