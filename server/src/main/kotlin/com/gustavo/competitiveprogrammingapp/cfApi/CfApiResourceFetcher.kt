package com.gustavo.competitiveprogrammingapp.cfApi

import org.springframework.stereotype.Component
import java.time.Duration
import java.time.LocalDateTime

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

    fun getProblemsetProblemsLastUpdate(): LocalDateTime {
        return fetcher.getLastUpdate("/problemset.problems")
    }

    fun getProblemsetProblems(requiredRecency: Duration = DEFAULT_RECENCY): ApiProblemsetProblemsResult {
        return fetcher.getResource("/problemset.problems", ApiProblemsetProblemsResult::class.java, requiredRecency)
    }

    fun getContestListLastUpdate(gym: Boolean = false): LocalDateTime {
        return fetcher.getLastUpdate("/contest.list?gym=$gym")
    }

    fun getContestList(gym: Boolean = false, requiredRecency: Duration = DEFAULT_RECENCY): ApiContestListResult {
        return fetcher.getResource("/contest.list?gym=$gym", ApiContestListResult::class.java, requiredRecency)
    }

    fun getContestStandingsLastUpdate(contestId: Int): LocalDateTime {
        return fetcher.getLastUpdate(
            "/contest.standings?contestId=$contestId"
        )
    }

    fun getContestStandings(contestId: Int, requiredRecency: Duration = DEFAULT_RECENCY): ApiContestStandingsResult {
        return fetcher.getResource(
            "/contest.standings?contestId=$contestId",
            ApiContestStandingsResult::class.java,
            requiredRecency
        )
    }

    fun getUserInfoLastUpdate(handles: List<String>): LocalDateTime {
        return fetcher.getLastUpdate("/user.info?handles=${handles.joinToString(";")}")
    }

    fun getUserInfo(
        handles: List<String>,
        requiredRecency: Duration = DEFAULT_RECENCY
    ): ApiUserInfoResult {
        return fetcher.getResource(
            "/user.info?handles=${handles.joinToString(";")}",
            ApiUserInfoResult::class.java,
            requiredRecency
        )
    }

    fun getUserStatusLastUpdate(handle: String): LocalDateTime {
        return fetcher.getLastUpdate("/user.status?handle=$handle")
    }

    fun getUserStatus(handle: String, requiredRecency: Duration = DEFAULT_RECENCY): ApiUserStatusResult {
        return fetcher.getResource("/user.status?handle=$handle", ApiUserStatusResult::class.java, requiredRecency)
    }
}
