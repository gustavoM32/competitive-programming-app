package com.gustavo.competitiveprogrammingapp.information.processors

import com.gustavo.competitiveprogrammingapp.cfApi.CfApiResourceFetcher
import com.gustavo.competitiveprogrammingapp.information.ProblemId
import com.gustavo.competitiveprogrammingapp.information.domain.CfProblem
import com.gustavo.competitiveprogrammingapp.information.repositories.CfProblemRepository
import com.gustavo.competitiveprogrammingapp.information.InformationService
import com.gustavo.competitiveprogrammingapp.information.InformationUtil
import com.gustavo.competitiveprogrammingapp.information.UpdateResponse
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.time.Duration

@Component
class CfProblemProcessor(
    val repository: CfProblemRepository,
    val informationService: InformationService,
    private val cfApiResourceFetcher: CfApiResourceFetcher
) {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    companion object {
        const val INFORMATION_ID = "CfProblem"
        var isUpdating = false
        val PROBLEMSET_PROBLEMS_CACHE_TOLERANCE: Duration = Duration.ofHours(1)
    }

    fun update(): UpdateResponse {
        if (isUpdating) return UpdateResponse(false, informationService.getLastUpdate(INFORMATION_ID))
        val shouldUpdate: Boolean

        try {
            isUpdating = true
            val lastUpdate = informationService.getLastUpdate(INFORMATION_ID)

            shouldUpdate = InformationUtil.shouldInformationReprocess(
                lastUpdate,
                cfApiResourceFetcher.getProblemsetProblemsLastUpdate(),
                PROBLEMSET_PROBLEMS_CACHE_TOLERANCE
            )

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
        logger.info("CfProblemProcessor update start...")
        val problemsetProblems = cfApiResourceFetcher.getProblemsetProblems(PROBLEMSET_PROBLEMS_CACHE_TOLERANCE)
        val problems = problemsetProblems.problems

        problems.let { ps ->
            val cfp = ps.mapNotNull { p ->
                if (p.contestId == null || p.index == null || p.name == null) null
                else CfProblem(ProblemId(p.contestId, p.index), p.name, p.rating)
            }
            repository.saveAll(cfp)
        }

        logger.info("CfProblemProcessor update completed.")
    }

    fun get(): List<CfProblem> {
        return repository.findAll()
    }

    fun reset() {
        repository.deleteAll()
        informationService.delete(INFORMATION_ID)
    }
}