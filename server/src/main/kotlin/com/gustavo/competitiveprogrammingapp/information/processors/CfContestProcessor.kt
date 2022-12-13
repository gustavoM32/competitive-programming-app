package com.gustavo.competitiveprogrammingapp.information.processors

import com.gustavo.competitiveprogrammingapp.cfApi.CfApiResourceFetcher
import com.gustavo.competitiveprogrammingapp.information.InformationService
import com.gustavo.competitiveprogrammingapp.information.InformationUtil
import com.gustavo.competitiveprogrammingapp.information.UpdateResponse
import com.gustavo.competitiveprogrammingapp.information.domain.CfContest
import com.gustavo.competitiveprogrammingapp.information.repositories.CfContestRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.cglib.core.Local
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

    fun update(): UpdateResponse {
        if (isUpdating) return UpdateResponse(false, informationService.getLastUpdate(INFORMATION_ID))
        val shouldUpdate: Boolean

        try {
            isUpdating = true
            val lastUpdate = informationService.getLastUpdate(INFORMATION_ID)

            shouldUpdate = InformationUtil.shouldInformationReprocess(
                lastUpdate,
                cfApiResourceFetcher.getContestListLastUpdate(false),
                CONTEST_LIST_CACHE_TOLERANCE
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
        logger.info("CfContestProcessor update start...")
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
        logger.info("CfContestProcessor update completed.")
    }

    fun get(): List<CfContest> {
        return repository.findAll()
    }

    fun reset() {
        repository.deleteAll()
        informationService.delete(CfProblemProcessor.INFORMATION_ID)
    }
}