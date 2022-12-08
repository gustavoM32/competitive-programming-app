package com.gustavo.competitiveprogrammingapp.information.processors

import com.gustavo.competitiveprogrammingapp.cfApi.CfApiResourceFetcher
import com.gustavo.competitiveprogrammingapp.information.InformationService
import com.gustavo.competitiveprogrammingapp.information.domain.CfUser
import com.gustavo.competitiveprogrammingapp.information.repositories.CfUserRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.time.Duration

@Component
class CfUserProcessor(
    private val repository: CfUserRepository,
    private val informationService: InformationService,
    private val cfApiResourceFetcher: CfApiResourceFetcher
) {
    companion object {
        const val INFORMATION_ID = "CfUser"
        private val isUpdatingSet = mutableSetOf<String>()
        val USER_STATUS_CACHE_TOLERANCE: Duration = Duration.ofHours(1)
    }

    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    fun update(user: String): Boolean {
        if (isUpdating(user)) return false
        val shouldUpdate: Boolean

        try {
            isUpdatingSet.add(user)
            shouldUpdate = informationService.doesNotExist(getId(user)).or(
                cfApiResourceFetcher.willUserInfoUpdate(listOf(user), USER_STATUS_CACHE_TOLERANCE)
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
        logger.info("CfUserProcessor update start...")
        val userInfo = cfApiResourceFetcher.getUserInfo(listOf(user), USER_STATUS_CACHE_TOLERANCE)[0]

        if (userInfo.handle == null) {
            logger.error("UserInfo with null handle. Expected to have thrown when parsing the API result")
            return
        }

        val cfUser = CfUser(
            handle = userInfo.handle,
            firstName = userInfo.firstName,
            lastName = userInfo.lastName,
            rating = userInfo.rating,
            maxRating = userInfo.maxRating
        )

        repository.save(cfUser)
        logger.info("CfUserProcessor update completed.")
    }

    fun get(user: String): CfUser {
        return repository.findById(user).orElseThrow { Exception("User $user was not found") }
    }

    fun reset() {
        repository.deleteAll()
        // TODO: Find a way to delete from the information repository.
    }

    private fun getId(user: String): String {
        return "${INFORMATION_ID}/$user"
    }
}