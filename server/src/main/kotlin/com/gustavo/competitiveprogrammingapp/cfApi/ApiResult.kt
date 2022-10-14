package com.gustavo.competitiveprogrammingapp.cfApi

import com.google.gson.JsonElement

data class ApiResult (
    val status: String? = null,
    val result: JsonElement? = null
)
