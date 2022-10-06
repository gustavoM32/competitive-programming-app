package com.gustavo.competitiveprogrammingapp.readOnly.cfSubmission

import org.springframework.data.mongodb.core.index.Indexed
import org.springframework.data.mongodb.core.mapping.Document

@Document("cfSubmissions")
data class CfSubmission(
    val id: String? = null,
    val user: String?,
    @Indexed
    val code: String?,
    val contestId: Int?,
    val index: String?,
    val verdict: String?,
)
