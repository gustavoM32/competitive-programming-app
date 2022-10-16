package com.gustavo.competitiveprogrammingapp.information

import com.gustavo.competitiveprogrammingapp.cfApi.ResourceFetcher
import com.gustavo.competitiveprogrammingapp.readOnly.cfContest.CfContest
import com.gustavo.competitiveprogrammingapp.readOnly.cfContest.CfContestRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneOffset

@Component
class CfContestsProcessor(
    private val resourceFetcher: ResourceFetcher,
    private val repository: CfContestRepository) : Processor {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    override fun update() {
        val contestList = resourceFetcher.getContestList()

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