package com.gustavo.competitiveprogrammingapp.information.processors

import com.gustavo.competitiveprogrammingapp.cfApi.CfApiResourceFetcher
import com.gustavo.competitiveprogrammingapp.information.InformationService
import com.gustavo.competitiveprogrammingapp.information.ProblemId
import com.gustavo.competitiveprogrammingapp.information.domain.ContestProblem
import com.gustavo.competitiveprogrammingapp.information.repositories.ContestProblemRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

/**
 * Extracts problems from CF contests
 */
@Component
class ContestProblemProcessor(
    val repository: ContestProblemRepository,
    val informationService: InformationService,
    private val cfApiResourceFetcher: CfApiResourceFetcher,
    private val cfContestProcessor: CfContestProcessor
) {
    companion object {
        const val INFORMATION_ID = "ContestProblem"
        var isUpdating = false
    }

    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    fun update(): Boolean {
        if (isUpdating) return false
        val shouldUpdate: Boolean

        try {
            isUpdating = true
            shouldUpdate = informationService.doesNotExist(INFORMATION_ID).or(
                cfContestProcessor.update()
            )
            // FIXME: Missing getContestStandings dependency.

            if (shouldUpdate) {
                process()
                informationService.update(INFORMATION_ID)
            }
        } finally {
            isUpdating = false
        }

        return shouldUpdate
    }

    fun process() {
        logger.info("Updating ContestProblem...")
        // get dependent data
        val cfContests = cfContestProcessor.get()
        val existingProblems = repository.findAll()

        // process it
        val contestProblems = mutableListOf<ContestProblem>()
        val fetchedContests = existingProblems.map { it.problemId.contestId }.toSet()

        cfContests.filter { !fetchedContests.contains(it.id) }.forEach a@{
            if (it.id < 1735) return@a // FIXME: only for development
            val contestStandings = cfApiResourceFetcher.getContestStandings(it.id)
            contestStandings.problems.forEach { p ->
                if (p.contestId != null && p.index != null && p.name != null && it.startTime != null)
                    contestProblems.add(
                        ContestProblem(
                            problemId = ProblemId(p.contestId, p.index),
                            name = p.name,
                            contestStartTime = it.startTime
                        )
                    )
            }
        }

        // save information
        repository.saveAll(contestProblems)
        logger.info("ContestProblem update completed.")
    }

    fun get(): List<ContestProblem> {
        return repository.findAll()
    }

    fun reset() {
        repository.deleteAll()
        informationService.delete(CfProblemProcessor.INFORMATION_ID)
    }
}