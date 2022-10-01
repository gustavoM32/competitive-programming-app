package com.gustavo.competitiveprogrammingapp.cfApi.information

import com.gustavo.competitiveprogrammingapp.cfApi.fetcher.resources.ResourceFetcher
import com.gustavo.competitiveprogrammingapp.domain.cfProblem.CfProblem
import com.gustavo.competitiveprogrammingapp.domain.cfProblem.CfProblemRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@Component
class ProblemsetProblemsProcessor(val resourceFetcher: ResourceFetcher, val repository: CfProblemRepository):
    Processor {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    // heavy: calculates the full information, drops the old database
    // light: only updates existing information

    override fun update() {
        val problemsetProblems = resourceFetcher.getProblemSetProblems()
        val problems = problemsetProblems.problems

        repository.deleteAll() // FIXME: deleting to avoid multiple entries, find a way to not need that
        logger.info("Drop database")
        problems?.let { ps ->
            val cfp = ps.map { p ->
                CfProblem(null, p.contestId.toString() + p.index, p.name, p.rating)
            }
            repository.saveAll(cfp)
        }
        logger.info("Updated database")
    }
}