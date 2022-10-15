package com.gustavo.competitiveprogrammingapp.cfApi.resources;

data class ContestListGson(
    val id: Int?,
    val name: String?,
    val phase: String?,
    val durationSeconds: Long?,
    val startTimeSeconds: Long?
    )
