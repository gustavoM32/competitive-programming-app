package com.gustavo.competitiveprogrammingapp.information.processors

import com.gustavo.competitiveprogrammingapp.information.InformationService
import com.gustavo.competitiveprogrammingapp.information.domain.CfProblem
import com.gustavo.competitiveprogrammingapp.information.ProblemId
import com.gustavo.competitiveprogrammingapp.information.UpdateResponse
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
    val repository: ProblemMappingRepository,
    val informationService: InformationService,
    private val cfProblemProcessor: CfProblemProcessor,
    private val contestProblemProcessor: ContestProblemProcessor
) {
    companion object {
        const val INFORMATION_ID = "ProblemMapping"
        var isUpdating = false
    }

    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    fun update(): UpdateResponse {
        if (isUpdating) return UpdateResponse(false, informationService.getLastUpdate(INFORMATION_ID))
        val shouldUpdate: Boolean

        try {
            isUpdating = true
            val lastUpdate = informationService.getLastUpdate(INFORMATION_ID)

            shouldUpdate = (lastUpdate < cfProblemProcessor.update().lastUpdate)
                .or(lastUpdate < contestProblemProcessor.update().lastUpdate)

            if (shouldUpdate) {
                process()
                informationService.update(INFORMATION_ID)
            }
        } finally {
            isUpdating = false
        }

        return UpdateResponse(shouldUpdate, informationService.getLastUpdate(INFORMATION_ID))
    }

    fun process() {
        logger.info("ProblemMappingProcessor update start...")
        // get dependent data
        val cfProblems = cfProblemProcessor.get()
        val contestProblems = contestProblemProcessor.get()

        // process it
        val result = getProblemMapping(cfProblems, contestProblems)

        // save information
        repository.saveAll(result.map {
            ProblemMapping(it.key, it.value)
        })

        logger.info("ProblemMappingProcessor update completed.")
    }

    fun get(): List<ProblemMapping> {
        return repository.findAll()
    }

    fun reset() {
        repository.deleteAll()
        informationService.delete(CfProblemProcessor.INFORMATION_ID)
    }

    private fun getProblemMapping(
        cfProblems: List<CfProblem>,
        contestProblems: List<ContestProblem>
    ): Map<ProblemId, ProblemId> {
        val problemMapping = mutableMapOf<ProblemId, ProblemId>()
        val associatedProblems = mutableMapOf<String, MutableList<ContestProblem>>()
        val problemAssociationId = mutableMapOf<ProblemId, String>()

        contestProblems.forEach {
            val associationId =
                "${it.contestStartTime}${it.name}" // problem association definition for this application

            problemAssociationId[it.problemId] = associationId
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
}