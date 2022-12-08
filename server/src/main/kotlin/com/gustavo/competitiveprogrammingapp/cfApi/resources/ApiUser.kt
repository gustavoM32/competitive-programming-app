package com.gustavo.competitiveprogrammingapp.cfApi.resources

data class ApiUser(
    val handle: String?,
    val firstName: String?,
    val lastName: String?,
    val rating: Int?,
    val maxRating: Int?
)