package com.gustavo.competitiveprogrammingapp.information.cfGymContest

import com.gustavo.competitiveprogrammingapp.cfApi.ResourceFetcher
import com.gustavo.competitiveprogrammingapp.information.Processor
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneOffset

@Component
class CfGymContestsProcessor(
    private val resourceFetcher: ResourceFetcher,
    private val repository: CfGymContestRepository
) : Processor {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    override fun update() {
        val contestList = resourceFetcher.getContestList(gym = true)

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
    }
}