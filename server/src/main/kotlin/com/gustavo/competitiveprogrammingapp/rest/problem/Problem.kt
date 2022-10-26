package com.gustavo.competitiveprogrammingapp.rest.problem

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.Field
import java.time.LocalDateTime

@Document("problems")
data class Problem(
    @Id
    val id: String? = null,
    @Field(name = "link")
    val link: String?,
    @Field(name = "dateAdded")
    var dateAdded: LocalDateTime?,
    @Field(name = "name")
    val name: String?,
    @Field(name = "problemStatus")
    val problemStatus: ProblemStatus = ProblemStatus.NOTHING,
    @Field(name = "editorialStatus")
    val editorialStatus: EditorialStatus = EditorialStatus.NOTHING,
    @Field(name = "comments")
    val comments: String = ""
)
