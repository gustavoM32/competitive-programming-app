package com.gustavo.competitiveprogrammingapp.information.domain

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

@Document("cfGymContests")
data class CfGymContest(
    @Id
    val id: Int? = null,
    val name: String?,
    val startTime: LocalDateTime?,
    val durationSeconds: Long?,
    val difficulty: Int?,
    val type: String?, // not API's type, that reffers to the contest format (ICPC or IOI)
    val region: String?,
    val country: String?,
    val season: String?,
)
