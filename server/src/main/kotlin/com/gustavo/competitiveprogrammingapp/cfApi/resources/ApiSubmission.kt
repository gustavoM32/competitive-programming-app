package com.gustavo.competitiveprogrammingapp.cfApi.resources

data class ApiSubmission(
    val id: Int?,
    val problem: ApiProblem?,
    val verdict: String?
)
