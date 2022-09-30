package com.gustavo.competitiveprogrammingapp.cfApi.resources

import com.gustavo.competitiveprogrammingapp.cfApi.fetcher.Fetcher
import org.springframework.stereotype.Component
import java.time.Duration

@Component
class ResourceFetcher(val fetcher: Fetcher) {
    fun getProblemSetProblems(): ProblemsetProblemsGson {
        val apiResource = "/problemset.problems"
        return fetcher.getResource(apiResource, ProblemsetProblemsGson::class.java, Duration.ofSeconds(10))
    }
}