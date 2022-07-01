package com.gustavo.competitiveprogrammingapp.problem

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.Field
import java.time.LocalDateTime

// TODO: maybe move this somewhere
enum class ProblemStatus {
    NOTHING, READ, WA, AC
}

// TODO: this too
enum class EditorialStatus {
    NOTHING, READ_BEFORE_AC, READ_AFTER_AC
}

@Document("problems")
data class Problem(
    @Id
    val id: String? = null,
    @Field(name = "link")
    val link: String,
    @Field(name = "date_added")
    val dateAdded: LocalDateTime,
    @Field(name = "name")
    val name: String?,
    @Field(name = "problem_status")
    val problemStatus: ProblemStatus = ProblemStatus.NOTHING,
    @Field(name = "editorial_status")
    val editorialStatus: EditorialStatus = EditorialStatus.NOTHING,
    @Field(name = "comments")
    val comments: String = ""
)
