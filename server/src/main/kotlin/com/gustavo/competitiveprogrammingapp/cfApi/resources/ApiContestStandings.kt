package com.gustavo.competitiveprogrammingapp.cfApi.resources

data class ApiContestStandings(
    val contest: ApiContest,
    val problems: List<ApiProblem>
)
