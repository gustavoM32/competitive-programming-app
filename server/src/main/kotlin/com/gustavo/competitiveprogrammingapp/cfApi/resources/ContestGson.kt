package com.gustavo.competitiveprogrammingapp.cfApi.resources;

data class ContestGson(
    val id: Int?,
    val name: String?,
    val phase: String?,
    val durationSeconds: Long?,
    val startTimeSeconds: Long?
    )
