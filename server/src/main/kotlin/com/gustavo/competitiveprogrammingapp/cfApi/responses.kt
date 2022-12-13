package com.gustavo.competitiveprogrammingapp.cfApi

import com.gustavo.competitiveprogrammingapp.cfApi.resources.ApiContest
import com.gustavo.competitiveprogrammingapp.cfApi.resources.ApiProblem
import com.gustavo.competitiveprogrammingapp.cfApi.resources.ApiSubmission
import com.gustavo.competitiveprogrammingapp.cfApi.resources.ApiUser

data class ApiProblemsetProblemsResult(
    val problems: List<ApiProblem>
    // val problemStatistics: List<ApiProblemStatistics> IGNORED
)

typealias ApiContestListResult = Array<ApiContest>

data class ApiContestStandingsResult(
    val contest: ApiContest,
    val problems: List<ApiProblem>
    //val rows: List<ApiRanklistRow> IGNORED
)

typealias ApiUserInfoResult = Array<ApiUser>

typealias ApiUserStatusResult = Array<ApiSubmission>

