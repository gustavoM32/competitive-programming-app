package com.gustavo.competitiveprogrammingapp.information.processors

import com.gustavo.competitiveprogrammingapp.cfApi.CfApiResourceFetcher
import com.gustavo.competitiveprogrammingapp.information.ProblemId
import com.gustavo.competitiveprogrammingapp.information.domain.CfProblem
import com.gustavo.competitiveprogrammingapp.information.domain.CfSubmission
import com.gustavo.competitiveprogrammingapp.information.repositories.CfSubmissionRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.time.Duration

@Component
class CfSubmissionProcessor(
    private val repository: CfSubmissionRepository,
    private val cfApiResourceFetcher: CfApiResourceFetcher
) {
    companion object {
        val USER_STATUS_CACHE_TOLERANCE: Duration = Duration.ofMinutes(1)
    }

    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    fun update(user: String): Boolean {
        val shouldUpdate = cfApiResourceFetcher.willUserStatusUpdate(user, USER_STATUS_CACHE_TOLERANCE)

        if (shouldUpdate) process(user)

        return shouldUpdate
    }

    fun process(user: String) {
        logger.info("CfSubmissionsProcessor update start...")
        val userStatus = cfApiResourceFetcher.getUserStatus(user)

        val cfSubmissions = userStatus.mapNotNull {
            if (it.id == null || it.problem?.contestId == null || it.problem.index == null || it.verdict == null) null
            else {
                CfSubmission(
                    id = it.id,
                    user = user,
                    problemId = ProblemId(it.problem.contestId, it.problem.index),
                    verdict = it.verdict
                )
            }
        }

        repository.saveAll(cfSubmissions)
        logger.info("CfSubmissionsProcessor update completed.")
    }

    fun get(user: String): List<CfSubmission> {
        return repository.findByUser(user)
    }

    fun reset() {
        repository.deleteAll()
    }
}