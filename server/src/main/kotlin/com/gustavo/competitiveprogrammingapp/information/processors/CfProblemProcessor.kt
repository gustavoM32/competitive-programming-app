package com.gustavo.competitiveprogrammingapp.information.processors

import com.gustavo.competitiveprogrammingapp.cfApi.CfApiResourceFetcher
import com.gustavo.competitiveprogrammingapp.information.ProblemId
import com.gustavo.competitiveprogrammingapp.information.domain.CfProblem
import com.gustavo.competitiveprogrammingapp.information.repositories.CfProblemRepository
import com.gustavo.competitiveprogrammingapp.information.InformationService
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

    fun update(): Boolean {
        if (isUpdating) return false
        val shouldUpdate: Boolean

        try {
            isUpdating = true
            shouldUpdate = informationService.doesNotExist(INFORMATION_ID).or(
                cfApiResourceFetcher.willProblemsetProblemsUpdate(
                    PROBLEMSET_PROBLEMS_CACHE_TOLERANCE
                )
            )

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
        logger.info("CfProblemsProcessor update start...")
        val problemsetProblems = cfApiResourceFetcher.getProblemsetProblems(PROBLEMSET_PROBLEMS_CACHE_TOLERANCE)
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

    fun get(): List<CfProblem> {
        return repository.findAll()
    }

    fun reset() {
        repository.deleteAll()
        informationService.delete(INFORMATION_ID)
    }
}