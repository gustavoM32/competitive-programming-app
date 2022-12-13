package com.gustavo.competitiveprogrammingapp.information

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

@Document("information")
data class Information(
    @Id
    val id: String,
    val lastUpdate: LocalDateTime
)
