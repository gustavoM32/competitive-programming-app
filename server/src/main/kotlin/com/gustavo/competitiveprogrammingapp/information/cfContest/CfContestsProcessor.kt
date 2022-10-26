package com.gustavo.competitiveprogrammingapp.information.cfContest

import com.gustavo.competitiveprogrammingapp.cfApi.CfApiResourceFetcher
import com.gustavo.competitiveprogrammingapp.information.SingleResourceProcessor
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneOffset

@Component
class CfContestsProcessor(
    override val repository: CfContestRepository,
    private val cfApiResourceFetcher: CfApiResourceFetcher
) : SingleResourceProcessor<CfContest, Int> {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    override fun update() {
        logger.info("CfContestsProcessor update start...")
        val contestList = cfApiResourceFetcher.getContestList()

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
}