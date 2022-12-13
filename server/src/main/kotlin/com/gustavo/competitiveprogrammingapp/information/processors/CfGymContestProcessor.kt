package com.gustavo.competitiveprogrammingapp.information.processors

import com.gustavo.competitiveprogrammingapp.cfApi.CfApiResourceFetcher
import com.gustavo.competitiveprogrammingapp.information.InformationService
import com.gustavo.competitiveprogrammingapp.information.InformationUtil
import com.gustavo.competitiveprogrammingapp.information.UpdateResponse
import com.gustavo.competitiveprogrammingapp.information.domain.CfGymContest
import com.gustavo.competitiveprogrammingapp.information.repositories.CfGymContestRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.time.Duration
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneOffset

@Component
class CfGymContestProcessor(
    val repository: CfGymContestRepository,
    val informationService: InformationService,
    private val cfApiResourceFetcher: CfApiResourceFetcher
) {
    companion object {
        const val INFORMATION_ID = "CfGymContest"
        var isUpdating = false
        val CONTEST_LIST_CACHE_TOLERANCE: Duration = Duration.ofHours(1)
    }

    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    fun update(): UpdateResponse {
        if (CfContestProcessor.isUpdating) return UpdateResponse(
            false,
            informationService.getLastUpdate(INFORMATION_ID)
        )
        val shouldUpdate: Boolean

        try {
            isUpdating = true
            val lastUpdate = informationService.getLastUpdate(INFORMATION_ID)

            shouldUpdate = InformationUtil.shouldInformationReprocess(
                lastUpdate, cfApiResourceFetcher.getContestListLastUpdate(true), CONTEST_LIST_CACHE_TOLERANCE
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
        logger.info("CfGymContestProcessor update start...")
        val contestList = cfApiResourceFetcher.getContestList(true, CONTEST_LIST_CACHE_TOLERANCE)

        repository.deleteAll() // FIXME: deleting to avoid multiple entries, find a way to not need that

        val cfGymContests = contestList.filter { c -> c.phase == "FINISHED" }.map { c ->
            CfGymContest(
                id = c.id,
                name = c.name,
                startTime = c.startTimeSeconds?.let {
                    LocalDateTime.ofInstant(
                        Instant.ofEpochSecond(it),
                        ZoneOffset.UTC
                    )
                },
                durationSeconds = c.durationSeconds,
                difficulty = c.difficulty,
                type = c.kind,
                region = c.icpcRegion,
                country = c.country,
                season = c.season
            )
        }

        repository.saveAll(cfGymContests)
        logger.info("CfGymContestProcessor update completed.")
    }

    fun get(): List<CfGymContest> {
        return repository.findAll()
    }

    fun reset() {
        repository.deleteAll()
        informationService.delete(INFORMATION_ID)
    }
}