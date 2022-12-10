package com.gustavo.competitiveprogrammingapp.information.domain

import com.gustavo.competitiveprogrammingapp.information.ProblemId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document("userSubmissions")
data class UserSubmissions(
    @Id
    val user: String,
    val submissions: List<CfSubmission>
)

data class CfSubmission(
    val id: Int,
    val problemId: ProblemId,
    val verdict: String,
)
