package com.gustavo.competitiveprogrammingapp.information.cfContest

import com.gustavo.competitiveprogrammingapp.cfApi.CfApiResourceFetcher
import com.gustavo.competitiveprogrammingapp.information.Processor
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneOffset

@Component
class CfContestsProcessor(
    private val cfApiResourceFetcher: CfApiResourceFetcher,
    private val repository: CfContestRepository
) : Processor {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    override fun update() {
        val contestList = cfApiResourceFetcher.getContestList()

        repository.deleteAll() // FIXME: deleting to avoid multiple entries, find a way to not need that

        val cfContests = contestList.filter { c -> c.phase == "FINISHED" }.map { c ->
            CfContest(
                id = c.id,
                name = c.name,
                startTime = c.startTimeSeconds?.let { LocalDateTime.ofInstant(Instant.ofEpochSecond(it), ZoneOffset.UTC) },
                durationSeconds = c.durationSeconds
            )
        }

        repository.saveAll(cfContests)
    }
}