package com.gustavo.competitiveprogrammingapp.information.domain

import com.gustavo.competitiveprogrammingapp.information.ProblemId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document("cfSubmissions")
data class CfSubmission(
    @Id
    val id: Int,
    val user: String,
    val problemId: ProblemId,
    val verdict: String,
)
