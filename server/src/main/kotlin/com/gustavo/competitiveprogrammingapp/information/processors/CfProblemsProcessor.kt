package com.gustavo.competitiveprogrammingapp.information.processors

import com.gustavo.competitiveprogrammingapp.cfApi.CfApiResourceFetcher
import com.gustavo.competitiveprogrammingapp.information.SingleResourceProcessor
import com.gustavo.competitiveprogrammingapp.information.ProblemId
import com.gustavo.competitiveprogrammingapp.information.domain.CfProblem
import com.gustavo.competitiveprogrammingapp.information.repositories.CfProblemRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@Component
class CfProblemsProcessor(
    override val repository: CfProblemRepository,
    private val cfApiResourceFetcher: CfApiResourceFetcher
) : SingleResourceProcessor<CfProblem, ProblemId> {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    override fun update() {
        logger.info("CfProblemsProcessor update start...")
        val problemsetProblems = cfApiResourceFetcher.getProblemsetProblems()
        val problems = problemsetProblems.problems

        problems.let { ps ->
            val cfp = ps.mapNotNull { p ->
                if (p.contestId == null || p.index == null || p.name == null) null
                else CfProblem(ProblemId(p.contestId, p.index), p.name, p.rating)
            }
            repository.saveAll(cfp)
        }

        logger.info("CfProblemsProcessor update completed.")
    }
}