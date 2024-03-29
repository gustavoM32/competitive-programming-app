package com.gustavo.competitiveprogrammingapp.cfApi

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.Field
import java.time.LocalDateTime

@Document("urlCache")
data class UrlCache(
    @Id
    val apiResource: String,
    val json: String,
    val lastUpdate: LocalDateTime
)
