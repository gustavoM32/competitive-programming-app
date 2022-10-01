package com.gustavo.competitiveprogrammingapp.readOnly.cfProblem

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.Field

@Document("cfProblems")
data class CfProblem(
    @Id
    val id: String? = null,
    @Field(name = "code")
    val code: String?,
    @Field(name = "name")
    val name: String?,
    @Field(name = "rating")
    val rating: Int?
)
