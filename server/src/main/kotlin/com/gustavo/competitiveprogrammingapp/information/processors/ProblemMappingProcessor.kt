package com.gustavo.competitiveprogrammingapp.information.processors

import com.gustavo.competitiveprogrammingapp.information.SingleResourceProcessor
import com.gustavo.competitiveprogrammingapp.information.domain.CfProblem
import com.gustavo.competitiveprogrammingapp.information.ProblemId
import com.gustavo.competitiveprogrammingapp.information.domain.ContestProblem
import com.gustavo.competitiveprogrammingapp.information.domain.ProblemMapping
import com.gustavo.competitiveprogrammingapp.information.repositories.ProblemMappingRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

/**
 * Maps CF regular problems duplicates to their problemset equivalent.
 */
@Component
class ProblemMappingProcessor(
    override val repository: ProblemMappingRepository,
    private val cfProblemProcessor: CfProblemProcessor,
    private val contestProblemProcessor: ContestProblemProcessor
) : SingleResourceProcessor<ProblemMapping, ProblemId> {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    private fun getProblemMapping(cfProblems: List<CfProblem>, contestProblems: List<ContestProblem>): Map<ProblemId, ProblemId> {
        val problemMapping = mutableMapOf<ProblemId, ProblemId>()
        val associatedProblems = mutableMapOf<String, MutableList<ContestProblem>>()
        val problemAssociationId = mutableMapOf<ProblemId, String>()

        contestProblems.forEach a@{
            val contestId = it.problemId.contestId
            val startTime = it.contestStartTime
            if (contestId < 1735) return@a // FIXME: this is to avoid too many request when developing

            val problemId = it.problemId
            val associationId = "${startTime}${it.name}" // problem association definition for this application

            problemAssociationId[problemId] = associationId
            if (!associatedProblems.containsKey(associationId)) associatedProblems[associationId] = mutableListOf(it)
            associatedProblems[associationId]!!.add(it)
        }

        cfProblems.forEach a@{
            val problemId = it.problemId
            val associationId = problemAssociationId[problemId]

            if (associationId == null) {
                logger.warn("Problem '$problemId' has no association id (it is not from any contest).")
                return@a
            }

            associatedProblems[associationId]!!.forEach { contestProblem ->
                if (contestProblem.problemId != problemId)
                    problemMapping[contestProblem.problemId] = problemId
            }
        }

        return problemMapping
    }

    override fun update() {
        logger.info("ProblemMappingProcessor update start...")
        // update and get dependent data
        val cfProblems = cfProblemProcessor.updateAndFindAll()
        val contestProblems = contestProblemProcessor.updateAndFindAll()

        // process it
        val result = getProblemMapping(cfProblems, contestProblems)

        // save information
        repository.saveAll(result.map {
            ProblemMapping(it.key, it.value)
        })

        logger.info("ProblemMappingProcessor update completed.")
    }
}