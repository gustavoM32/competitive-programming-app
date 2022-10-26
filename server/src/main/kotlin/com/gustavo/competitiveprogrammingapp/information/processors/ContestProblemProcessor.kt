package com.gustavo.competitiveprogrammingapp.information.processors

import com.gustavo.competitiveprogrammingapp.cfApi.CfApiResourceFetcher
import com.gustavo.competitiveprogrammingapp.information.SingleResourceProcessor
import com.gustavo.competitiveprogrammingapp.information.repositories.CfContestRepository
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
    override val repository: ContestProblemRepository,
    private val cfApiResourceFetcher: CfApiResourceFetcher,
    private val cfContestsProcessor: CfContestsProcessor,
    private val cfContestsRepository: CfContestRepository
) : SingleResourceProcessor<ContestProblem, ProblemId> {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    override fun update() {
        logger.info("Updating ContestProblem...")
        // update dependent data
        cfContestsProcessor.update()

        // get dependent data
        val cfContests = cfContestsRepository.findAll()
        val existingProblems = repository.findAll()

        // process it
        val contestProblems = mutableListOf<ContestProblem>()
        val fetchedContests = existingProblems.map { it.problemId.contestId }.toSet()

        cfContests.filter{ !fetchedContests.contains(it.id) }.forEach a@{
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
}