package com.gustavo.competitiveprogrammingapp.information.domain

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document("userContestStatus")
data class UserContestStatus(
    @Id
    val user: String,
    val contestsStatus: List<ContestStatus>
)

data class ContestStatus(
    val id: Int,
    val contestStatus: ContestStatusEnum,
)

enum class ContestStatusEnum {
    CLEAN, DIRTY, COMPLETED
}
