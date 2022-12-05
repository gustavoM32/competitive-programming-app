package com.gustavo.competitiveprogrammingapp.cfApi

import org.springframework.stereotype.Component
import java.time.Duration

/**
 * ResourceFetcher is the Kotlin interface with the Codeforces API. Any requests to the Codeforces API should be made
 * through methods used here, their names and parameters should match the API specification. It uses Fetcher to get make
 * the actual calls to the API.
 */
@Component
class CfApiResourceFetcher(val fetcher: Fetcher) {
    companion object {
        val DEFAULT_RECENCY: Duration = Duration.ofSeconds(1000L)
    }

    fun willProblemsetProblemsUpdate(requiredRecency: Duration = DEFAULT_RECENCY): Boolean {
        return fetcher.willFetch("/problemset.problems", requiredRecency)
    }

    fun getProblemsetProblems(requiredRecency: Duration = DEFAULT_RECENCY): ApiProblemsetProblemsResult {
        return fetcher.getResource("/problemset.problems", ApiProblemsetProblemsResult::class.java, requiredRecency)
    }

    fun willContestListUpdate(gym: Boolean = false, requiredRecency: Duration = DEFAULT_RECENCY): Boolean {
        return fetcher.willFetch("/contest.list?gym=$gym", requiredRecency)
    }

    fun getContestList(gym: Boolean = false, requiredRecency: Duration = DEFAULT_RECENCY): ApiContestListResult {
        return fetcher.getResource("/contest.list?gym=$gym", ApiContestListResult::class.java, requiredRecency)
    }

    fun willContestStandingsUpdate(contestId: Int, requiredRecency: Duration = DEFAULT_RECENCY): Boolean {
        return fetcher.willFetch(
            "/contest.standings?contestId=$contestId",
            requiredRecency
        )
    }

    fun getContestStandings(contestId: Int, requiredRecency: Duration = DEFAULT_RECENCY): ApiContestStandingsResult {
        return fetcher.getResource(
            "/contest.standings?contestId=$contestId",
            ApiContestStandingsResult::class.java,
            requiredRecency
        )
    }

    fun willUserStatusUpdate(user: String, requiredRecency: Duration = DEFAULT_RECENCY): Boolean {
        return fetcher.willFetch("/user.status?handle=$user", requiredRecency)
    }

    fun getUserStatus(user: String, requiredRecency: Duration = DEFAULT_RECENCY): ApiUserStatusResult {
        return fetcher.getResource("/user.status?handle=$user", ApiUserStatusResult::class.java, requiredRecency)
    }
}
