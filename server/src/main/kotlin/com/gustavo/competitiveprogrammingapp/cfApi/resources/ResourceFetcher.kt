package com.gustavo.competitiveprogrammingapp.cfApi.resources

import com.gustavo.competitiveprogrammingapp.cfApi.Fetcher
import org.springframework.stereotype.Component
import java.time.Duration

const val DEV_CACHE_DURATION = 10L

@Component
class ResourceFetcher(val fetcher: Fetcher) {
    fun getProblemSetProblems(): ProblemsetProblemsGson {
        val apiResource = "/problemset.problems"
        return fetcher.getResource(apiResource, ProblemsetProblemsGson::class.java, Duration.ofSeconds(DEV_CACHE_DURATION))
    }

    fun getContestList(): Array<ContestGson> {
        val apiResource = "/contest.list"
        return fetcher.getResource(apiResource, Array<ContestGson>::class.java, Duration.ofSeconds(DEV_CACHE_DURATION))
    }

    fun getGymContestList(): Array<GymContestGson> {
        val apiResource = "/contest.list?gym=true"
        return fetcher.getResource(apiResource, Array<GymContestGson>::class.java, Duration.ofSeconds(DEV_CACHE_DURATION))
    }

    fun getUserStatus(user: String): Array<UserStatusGson> {
        val apiResource = "/user.status?handle=$user"
        return fetcher.getResource(apiResource, Array<UserStatusGson>::class.java, Duration.ofSeconds(DEV_CACHE_DURATION))
    }
}
