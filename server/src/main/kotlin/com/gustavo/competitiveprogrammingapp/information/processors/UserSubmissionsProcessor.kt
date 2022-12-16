package com.gustavo.competitiveprogrammingapp.information.processors

import com.gustavo.competitiveprogrammingapp.cfApi.CfApiResourceFetcher
import com.gustavo.competitiveprogrammingapp.information.InformationService
import com.gustavo.competitiveprogrammingapp.information.InformationUtil
import com.gustavo.competitiveprogrammingapp.information.ProblemId
import com.gustavo.competitiveprogrammingapp.information.UpdateResponse
import com.gustavo.competitiveprogrammingapp.information.domain.CfSubmission
import com.gustavo.competitiveprogrammingapp.information.domain.UserSubmissions
import com.gustavo.competitiveprogrammingapp.information.repositories.UserSubmissionsRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.time.Duration

@Component
class UserSubmissionsProcessor(
    private val repository: UserSubmissionsRepository,
    private val informationService: InformationService,
    private val cfApiResourceFetcher: CfApiResourceFetcher
) {
    companion object {
        const val INFORMATION_ID = "UserSubmissions"
        private val isUpdatingSet = mutableSetOf<String>()
        val USER_STATUS_CACHE_TOLERANCE: Duration = Duration.ofSeconds(30);
    }

    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    fun update(user: String): UpdateResponse {
        if (isUpdating(user)) return UpdateResponse(false, informationService.getLastUpdate(getId(user)))
        val shouldUpdate: Boolean

        try {
            isUpdatingSet.add(user)
            val lastUpdate = informationService.getLastUpdate(getId(user))

            shouldUpdate = InformationUtil.shouldInformationReprocess(
                lastUpdate,
                cfApiResourceFetcher.getUserStatusLastUpdate(user),
                USER_STATUS_CACHE_TOLERANCE
            )

            if (shouldUpdate) {
                process(user)
                informationService.update(getId(user))
            }
        } finally {
            isUpdatingSet.remove(user)
        }

        return UpdateResponse(shouldUpdate, informationService.getLastUpdate(getId(user)))
    }

    fun isUpdating(user: String): Boolean {
        return isUpdatingSet.contains(user)
    }

    fun process(user: String) {
        logger.info("CfSubmissionProcessor update start...")
        val userStatus = cfApiResourceFetcher.getUserStatus(user, USER_STATUS_CACHE_TOLERANCE)

        val cfSubmissions = userStatus.mapNotNull {
            if (it.id == null || it.problem?.contestId == null || it.problem.index == null || it.verdict == null) null
            else {
                CfSubmission(
                    id = it.id,
                    problemId = ProblemId(it.problem.contestId, it.problem.index),
                    verdict = it.verdict
                )
            }
        }

        repository.save(UserSubmissions(user, cfSubmissions))
        logger.info("CfSubmissionProcessor update completed.")
    }

    fun get(user: String): List<CfSubmission> {
        return repository.findById(user).map { it.submissions }.orElse(emptyList())
    }

    fun reset() {
        repository.deleteAll()
        // TODO: Find a way to delete from the information repository.
    }

    private fun getId(user: String): String {
        return "${INFORMATION_ID}/$user"
    }
}
