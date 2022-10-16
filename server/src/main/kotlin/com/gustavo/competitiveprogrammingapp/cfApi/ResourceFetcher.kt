package com.gustavo.competitiveprogrammingapp.cfApi

import com.gustavo.competitiveprogrammingapp.cfApi.resources.ApiContest
import com.gustavo.competitiveprogrammingapp.cfApi.resources.ApiProblem
import com.gustavo.competitiveprogrammingapp.cfApi.resources.ApiProblemList
import com.gustavo.competitiveprogrammingapp.cfApi.resources.ApiSubmission
import org.springframework.stereotype.Component
import java.time.Duration

/**
 * ResourceFetcher is the Kotlin interface with the Codeforces API. Any requests to the Codeforces API should be made
 * through methods used here, their names and parameters should match the API specification. It uses Fetcher to get make
 * the actual calls to the API.
 */
@Component
class ResourceFetcher(val fetcher: Fetcher) {
    companion object {
        val DEFAULT_RECENCY: Duration = Duration.ofSeconds(10L)
    }

    fun getProblemSetProblems(requiredRecency: Duration = DEFAULT_RECENCY): ApiProblemList {
        val apiResource = "/problemset.problems"
        return fetcher.getResource(apiResource, ApiProblemList::class.java, requiredRecency)
    }

    fun getContestList(gym: Boolean = false, requiredRecency: Duration = DEFAULT_RECENCY): Array<ApiContest> {
        val apiResource = "/contest.list?gym=$gym"
        return fetcher.getResource(apiResource, Array<ApiContest>::class.java, requiredRecency)
    }

    fun getUserStatus(user: String, requiredRecency: Duration = DEFAULT_RECENCY): Array<ApiSubmission> {
        val apiResource = "/user.status?handle=$user"
        return fetcher.getResource(apiResource, Array<ApiSubmission>::class.java, requiredRecency)
    }
}
