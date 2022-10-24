package com.gustavo.competitiveprogrammingapp.information.cfProblem

import com.gustavo.competitiveprogrammingapp.cfApi.CfApiResourceFetcher
import com.gustavo.competitiveprogrammingapp.information.Processor
import com.gustavo.competitiveprogrammingapp.information.newInformation.ProblemId
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@Component
class CfProblemsProcessor(val cfApiResourceFetcher: CfApiResourceFetcher, val repository: CfProblemRepository) :
    Processor {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    // heavy: calculates the full information, drops the old database
    // light: only updates existing information

    override fun update() {
        val problemsetProblems = cfApiResourceFetcher.getProblemsetProblems()
        val problems = problemsetProblems.problems

        repository.deleteAll() // FIXME: deleting to avoid multiple entries, find a way to not need that
        logger.info("Drop database")
        problems.let { ps ->
            val cfp = ps.mapNotNull { p ->
                if (p.contestId == null || p.index == null || p.name == null) null
                else CfProblem(ProblemId(p.contestId, p.index), p.name, p.rating)
            }
            repository.saveAll(cfp)
        }
        logger.info("Updated database")
    }
}