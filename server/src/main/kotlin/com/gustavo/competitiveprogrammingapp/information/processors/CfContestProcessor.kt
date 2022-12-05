package com.gustavo.competitiveprogrammingapp.information.processors

import com.gustavo.competitiveprogrammingapp.cfApi.CfApiResourceFetcher
import com.gustavo.competitiveprogrammingapp.information.InformationService
import com.gustavo.competitiveprogrammingapp.information.domain.CfContest
import com.gustavo.competitiveprogrammingapp.information.repositories.CfContestRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.time.Duration
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneOffset

@Component
class CfContestProcessor(
    val repository: CfContestRepository,
    val informationService: InformationService,
    private val cfApiResourceFetcher: CfApiResourceFetcher
) {
    companion object {
        const val INFORMATION_ID = "CfContest"
        var isUpdating = false
        val CONTEST_LIST_CACHE_TOLERANCE: Duration = Duration.ofHours(1)
    }

    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    fun update(): Boolean {
        if (isUpdating) return false
        val shouldUpdate: Boolean

        try {
            isUpdating = true
            shouldUpdate = informationService.doesNotExist(INFORMATION_ID).or(
                cfApiResourceFetcher.willContestListUpdate(false, CONTEST_LIST_CACHE_TOLERANCE)
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
        logger.info("CfContestsProcessor update start...")
        val contestList = cfApiResourceFetcher.getContestList(false, CONTEST_LIST_CACHE_TOLERANCE)

        val cfContests = contestList.filter { c -> c.phase == "FINISHED" }.mapNotNull { c ->
            if (c.id == null || c.name == null) null
            else
                CfContest(
                    id = c.id,
                    name = c.name,
                    startTime = c.startTimeSeconds?.let {
                        LocalDateTime.ofInstant(
                            Instant.ofEpochSecond(it),
                            ZoneOffset.UTC
                        )
                    },
                    durationSeconds = c.durationSeconds
                )
        }

        repository.saveAll(cfContests)
        logger.info("CfContestsProcessor update completed.")
    }

    fun get(): List<CfContest> {
        return repository.findAll()
    }

    fun reset() {
        repository.deleteAll()
        informationService.delete(CfProblemProcessor.INFORMATION_ID)
    }
}