package com.gustavo.competitiveprogrammingapp.readOnly.cfGymContest

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

@Document("cfGym")
data class CfGym(
    @Id
    val id: Int? = null,
    val name: String?,
    val startTime: LocalDateTime?,
    val durationSeconds: Long?,
)
