package com.gustavo.competitiveprogrammingapp.domain.problemList

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.Field
import java.time.LocalDateTime

@Document("problemLists")
data class ProblemList(
    @Id
    val id: String? = null,
    @Field(name = "link")
    val link: String?,
    @Field(name = "name")
    val name: String?,
    @Field(name = "description")
    val description: String?,
    @Field(name = "notes")
    val notes: String?,
    @Field(name = "dateAdded")
    val dateAdded: LocalDateTime?,
    @Field(name = "solvedCount")
    val solvedCount: Int?,
    @Field(name = "totalCount")
    val totalCount: Int?,
)
