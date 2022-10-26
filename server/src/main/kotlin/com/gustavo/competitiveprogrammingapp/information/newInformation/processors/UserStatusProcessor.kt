package com.gustavo.competitiveprogrammingapp.information.newInformation.processors

import com.gustavo.competitiveprogrammingapp.cfApi.CfApiResourceFetcher
import com.gustavo.competitiveprogrammingapp.cfApi.resources.ApiProblem
import com.gustavo.competitiveprogrammingapp.information.Processor
import com.gustavo.competitiveprogrammingapp.information.cfContest.CfContest
import com.gustavo.competitiveprogrammingapp.information.cfContest.CfContestsProcessor
import com.gustavo.competitiveprogrammingapp.information.cfProblem.CfProblem
import com.gustavo.competitiveprogrammingapp.information.cfProblem.CfProblemsProcessor
import com.gustavo.competitiveprogrammingapp.information.cfSubmission.CfSubmission
import com.gustavo.competitiveprogrammingapp.information.cfSubmission.CfSubmissionsProcessor
import com.gustavo.competitiveprogrammingapp.information.newInformation.ProblemId
import com.gustavo.competitiveprogrammingapp.information.newInformation.domain.ContestProblem
import com.gustavo.competitiveprogrammingapp.information.newInformation.domain.ContestStatus
import com.gustavo.competitiveprogrammingapp.information.newInformation.domain.UserContestStatus
import com.gustavo.competitiveprogrammingapp.information.newInformation.domain.UserProblemStatus
import com.gustavo.competitiveprogrammingapp.information.newInformation.repositories.UserContestStatusRepository
import com.gustavo.competitiveprogrammingapp.information.newInformation.repositories.UserProblemStatusRepository
import com.gustavo.competitiveprogrammingapp.rest.problem.ProblemStatus
import com.gustavo.competitiveprogrammingapp.util.Timer
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@Component
class UserStatusProcessor(
    private val userProblemStatusRepository: UserProblemStatusRepository,
    private val userContestStatusRepository: UserContestStatusRepository,
    private val problemMappingProcessor: ProblemMappingProcessor,
    private val cfProblemsProcessor: CfProblemsProcessor,
    private val cfContestsProcessor: CfContestsProcessor,
    private val contestProblemProcessor: ContestProblemProcessor,
    private val cfSubmissionsProcessor: CfSubmissionsProcessor
) : Processor {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    fun getProblemStatusMap(problemsetProblems: List<CfProblem>, problemMapping: Map<ProblemId, ProblemId>, userStatus: List<CfSubmission>): Map<ProblemId, ProblemStatus> {
        val problemStatusMap = mutableMapOf<ProblemId, ProblemStatus>()

        userStatus.forEach a@{
            val mappedTo = problemMapping.getOrDefault(it.problemId, it.problemId)

            if (it.verdict == "OK") problemStatusMap[mappedTo] = ProblemStatus.AC
            else if (problemStatusMap.getOrDefault(mappedTo, ProblemStatus.NOTHING) != ProblemStatus.AC)
                problemStatusMap[mappedTo] = ProblemStatus.WA
        }
        return problemStatusMap
    }

    fun getContestStatusMap(contestProblems: List<ContestProblem>, problemMapping: Map<ProblemId, ProblemId>, problemStatusMap: Map<ProblemId, ProblemStatus>): Map<Int, ContestStatus> {
        val contestStatusMap = mutableMapOf<Int, ContestStatus>()

        contestProblems.forEach a@{
            val contestId = it.problemId.contestId

            val mappedTo = problemMapping.getOrDefault(it.problemId, it.problemId)
            val problemStatus = problemStatusMap.getOrDefault(mappedTo, ProblemStatus.NOTHING)

            if (!contestStatusMap.containsKey(contestId)) {
                contestStatusMap[contestId] = when (problemStatus) {
                    ProblemStatus.NOTHING -> ContestStatus.CLEAN
                    ProblemStatus.AC -> ContestStatus.COMPLETED
                    else -> ContestStatus.DIRTY
                }
            } else if (!(contestStatusMap[contestId] == ContestStatus.CLEAN && problemStatus == ProblemStatus.NOTHING ||
                    contestStatusMap[contestId] == ContestStatus.COMPLETED && problemStatus == ProblemStatus.AC)) {
                contestStatusMap[contestId] = ContestStatus.DIRTY
            }
        }

        return contestStatusMap
    }

    override fun update() {
        logger.info("UserStatusProcessor update start...")
        val user = "gustavo_m32" // TODO: get user in the parameter
        val timer = Timer("Problemset update")

        // update and get dependent data
        val cfProblems = cfProblemsProcessor.updateAndFindAll()
        val cfContests = cfContestsProcessor.updateAndFindAll()
        val contestProblems = contestProblemProcessor.updateAndFindAll()
        val problemMappingList = problemMappingProcessor.updateAndFindAll()
        val userSubmissions = cfSubmissionsProcessor.updateAndFindAll(user)
        timer.check("Got dependent data")

        // process it
        val problemMapping = problemMappingList.associateBy({it.contestProblemId}, {it.problemsetProblemId})
        timer.check("Processed problemMapping")

        // get problems status from user submissions, with the mapping
        val problemStatusMap = getProblemStatusMap(cfProblems, problemMapping, userSubmissions)
        timer.check("problemStatusMap calculated")

        // get contest status from its problems
        val contestStatusMap = getContestStatusMap(contestProblems, problemMapping, problemStatusMap)
        timer.check("contestStatusMap calculated")

        val userProblemStatus = cfProblems.map { p ->
            UserProblemStatus(
                problemId = p.problemId,
                user = user,
                problemStatus = problemStatusMap.getOrDefault(p.problemId, ProblemStatus.NOTHING),
                contestStatus = contestStatusMap.getOrDefault(p.problemId.contestId, ContestStatus.CLEAN)
            )
        }
        timer.check("userProblemStatus calculated")

        val userContestStatus = cfContests.map { c ->
            UserContestStatus(
                id = c.id,
                user = user,
                contestStatus = contestStatusMap.getOrDefault(c.id, ContestStatus.CLEAN)
            )
        }
        timer.check("userContestStatus calculated")

        // save information
        userProblemStatusRepository.saveAll(userProblemStatus)
        userContestStatusRepository.saveAll(userContestStatus)

        logger.info("UserStatusProcessor update completed.")
    }

    override fun reset() {
        userProblemStatusRepository.deleteAll()
        userContestStatusRepository.deleteAll()
        update()
    }
}