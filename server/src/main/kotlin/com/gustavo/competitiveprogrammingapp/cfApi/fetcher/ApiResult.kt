package com.gustavo.competitiveprogrammingapp.cfApi.fetcher

import com.google.gson.JsonElement

data class ApiResult (
    val status: String? = null,
    val result: JsonElement? = null
)
