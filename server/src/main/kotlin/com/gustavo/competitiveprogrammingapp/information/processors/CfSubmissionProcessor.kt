package com.gustavo.competitiveprogrammingapp.information.processors

import com.gustavo.competitiveprogrammingapp.cfApi.CfApiResourceFetcher
import com.gustavo.competitiveprogrammingapp.information.InformationService
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
    private val informationService: InformationService,
    private val cfApiResourceFetcher: CfApiResourceFetcher
) {
    companion object {
        const val INFORMATION_ID = "CfSubmission"
        private val isUpdatingSet = mutableSetOf<String>()
        val USER_STATUS_CACHE_TOLERANCE: Duration = Duration.ofMinutes(1)
    }

    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    fun update(user: String): Boolean {
        if (isUpdating(user)) return false
        val shouldUpdate: Boolean

        try {
            isUpdatingSet.add(user)
            shouldUpdate = informationService.doesNotExist(getId(user)).or(
                cfApiResourceFetcher.willUserStatusUpdate(user, USER_STATUS_CACHE_TOLERANCE)
            );

            if (shouldUpdate) {
                process(user)
                informationService.update(getId(user))
            }
        } finally {
            isUpdatingSet.remove(user)
        }

        return shouldUpdate
    }

    fun isUpdating(user: String): Boolean {
        return isUpdatingSet.contains(user)
    }

    fun process(user: String) {
        logger.info("CfSubmissionsProcessor update start...")
        val userStatus = cfApiResourceFetcher.getUserStatus(user, USER_STATUS_CACHE_TOLERANCE)

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
        // TODO: Find a way to delete from the information repository.
    }

    private fun getId(user: String): String {
        return "${INFORMATION_ID}/$user"
    }
}