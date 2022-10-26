package com.gustavo.competitiveprogrammingapp.information.processors

import com.gustavo.competitiveprogrammingapp.cfApi.CfApiResourceFetcher
import com.gustavo.competitiveprogrammingapp.information.SingleResourceProcessor
import com.gustavo.competitiveprogrammingapp.information.domain.CfGymContest
import com.gustavo.competitiveprogrammingapp.information.repositories.CfGymContestRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneOffset

@Component
class CfGymContestProcessor(
    override val repository: CfGymContestRepository,
    private val cfApiResourceFetcher: CfApiResourceFetcher
) : SingleResourceProcessor<CfGymContest, Int> {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    override fun update() {
        logger.info("CfGymContestsProcessor update start...")
        val contestList = cfApiResourceFetcher.getContestList(gym = true)

        repository.deleteAll() // FIXME: deleting to avoid multiple entries, find a way to not need that

        val cfGymContests = contestList.filter { c -> c.phase == "FINISHED" }.map { c ->
            CfGymContest(
                id = c.id,
                name = c.name,
                startTime = c.startTimeSeconds?.let { LocalDateTime.ofInstant(Instant.ofEpochSecond(it), ZoneOffset.UTC) },
                durationSeconds = c.durationSeconds,
                difficulty = c.difficulty,
                type = c.kind,
                region = c.icpcRegion,
                country = c.country,
                season = c.season
            )
        }

        repository.saveAll(cfGymContests)
        logger.info("CfGymContestsProcessor update completed.")
    }
}