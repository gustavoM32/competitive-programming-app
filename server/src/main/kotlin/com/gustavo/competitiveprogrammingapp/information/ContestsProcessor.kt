package com.gustavo.competitiveprogrammingapp.information

import com.gustavo.competitiveprogrammingapp.cfApi.resources.ResourceFetcher
import com.gustavo.competitiveprogrammingapp.readOnly.cfContest.CfContest
import com.gustavo.competitiveprogrammingapp.readOnly.cfContest.CfContestRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@Component
class ContestsProcessor(
    private val resourceFetcher: ResourceFetcher,
    private val repository: CfContestRepository) : Processor {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    override fun update() {
        val contestList = resourceFetcher.getContestList()

        repository.deleteAll() // FIXME: deleting to avoid multiple entries, find a way to not need that

        val cfContests = contestList.map { c ->
            CfContest(c.id, c.name)
        }
        repository.saveAll(cfContests)
    }
}