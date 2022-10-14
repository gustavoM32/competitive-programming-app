package com.gustavo.competitiveprogrammingapp.cfApi.resources

data class ProblemsetProblemsGson(
    val problems: List<Problem>? = null
) {
    data class Problem(
        val contestId: Int? = null,
        val index: String? = null,
        val name: String? = null,
        val rating: Int? = null
    )
}
