package com.gustavo.competitiveprogrammingapp.information.cfSubmission

import com.gustavo.competitiveprogrammingapp.information.newInformation.ProblemId
import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document

@Document("cfSubmissions")
data class CfSubmission(
    val id: String? = null,
    val user: String,
    val problemId: ProblemId,
    val verdict: String,
)
