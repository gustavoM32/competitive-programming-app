package com.gustavo.competitiveprogrammingapp.cfApi.resources

data class UserStatusGson(
    val id: Int?,
    val problem: Problem?,
    val verdict: String?
) {
    data class Problem(
        val contestId: Int?,
        val index: String?
    )
}
