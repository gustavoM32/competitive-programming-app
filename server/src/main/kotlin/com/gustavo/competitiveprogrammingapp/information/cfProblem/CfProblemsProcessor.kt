package com.gustavo.competitiveprogrammingapp.information.cfProblem

import com.gustavo.competitiveprogrammingapp.cfApi.ResourceFetcher
import com.gustavo.competitiveprogrammingapp.information.Processor
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@Component
class CfProblemsProcessor(val resourceFetcher: ResourceFetcher, val repository: CfProblemRepository):
    Processor {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    // heavy: calculates the full information, drops the old database
    // light: only updates existing information

    override fun update() {
        val problemsetProblems = resourceFetcher.getProblemsetProblems()
        val problems = problemsetProblems.problems

        repository.deleteAll() // FIXME: deleting to avoid multiple entries, find a way to not need that
        logger.info("Drop database")
        problems?.let { ps ->
            val cfp = ps.map { p ->
                val code = "${p.contestId.toString()}${p.index}"
                CfProblem(code, p.contestId, p.index, p.name, p.rating)
            }
            repository.saveAll(cfp)
        }
        logger.info("Updated database")
    }
}