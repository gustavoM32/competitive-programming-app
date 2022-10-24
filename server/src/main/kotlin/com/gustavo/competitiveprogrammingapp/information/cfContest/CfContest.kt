package com.gustavo.competitiveprogrammingapp.information.cfContest

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

@Document("cfContests")
data class CfContest(
    @Id
    val id: Int,
    val name: String,
    val startTime: LocalDateTime?,
    val durationSeconds: Long?,
)
