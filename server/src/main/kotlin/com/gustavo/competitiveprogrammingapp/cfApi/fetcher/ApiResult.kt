package com.gustavo.competitiveprogrammingapp.cfApi.fetcher

import com.google.gson.JsonObject

data class ApiResult (
    val status: String? = null,
    val result: JsonObject? = null
)
