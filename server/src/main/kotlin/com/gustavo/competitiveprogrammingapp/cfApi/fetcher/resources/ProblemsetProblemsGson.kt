package com.gustavo.competitiveprogrammingapp.cfApi.fetcher.resources

data class ProblemsetProblemsGson(
    val problems: List<Problem>? = null
) {
    data class Problem(
        val contestId: Int? = null,
        val index: String? = null,
        val name: String? = null
    )
}
