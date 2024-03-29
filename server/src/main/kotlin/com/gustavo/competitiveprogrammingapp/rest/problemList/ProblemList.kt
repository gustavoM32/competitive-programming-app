package com.gustavo.competitiveprogrammingapp.rest.problemList

import com.gustavo.competitiveprogrammingapp.rest.problem.Problem
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.DocumentReference
import org.springframework.data.mongodb.core.mapping.Field
import java.time.LocalDateTime

@Document("problemLists")
data class ProblemList(
    @Id
    val id: String? = null,
    val link: String?,
    val name: String?,
    val description: String?,
    val notes: String?,
    var dateAdded: LocalDateTime?,
    val solvedCount: Int?,
    val totalCount: Int?,
    val createdBy: String?,

    @DocumentReference(lazy = true)
    @Field val problems: MutableList<Problem> = mutableListOf(), // problem list has many problems
)
