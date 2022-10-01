package com.gustavo.competitiveprogrammingapp.cfApi.information

import com.gustavo.competitiveprogrammingapp.cfApi.fetcher.resources.ResourceFetcher
import com.gustavo.competitiveprogrammingapp.domain.cfContest.CfContest
import com.gustavo.competitiveprogrammingapp.domain.cfContest.CfContestRepository
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
        contestList.forEach { c ->
            repository.save(CfContest(c.id, c.name))
        }
    }
}