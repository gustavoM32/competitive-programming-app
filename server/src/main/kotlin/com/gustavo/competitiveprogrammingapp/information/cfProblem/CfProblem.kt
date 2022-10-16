package com.gustavo.competitiveprogrammingapp.information.cfProblem

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document("cfProblems")
data class CfProblem(
    @Id
    val code: String? = null,
    val contestId: Int?,
    val index: String?,
    val name: String?,
    val rating: Int?,
)
