package com.gustavo.competitiveprogrammingapp.information.domain

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

enum class ContestStatus {
    CLEAN, DIRTY, COMPLETED
}

@Document("userContestStatus")
data class UserContestStatus(
    @Id
    val id: Int,
    val user: String,
    val contestStatus: ContestStatus,
)