package com.gustavo.competitiveprogrammingapp.rest.problem

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.Field
import java.time.LocalDateTime

@Document("problems")
data class Problem(
    @Id
    val id: String? = null,
    val link: String?,
    var dateAdded: LocalDateTime?,
    val name: String?,
    val problemStatus: ProblemStatusEnum = ProblemStatusEnum.NOTHING,
    val editorialStatus: EditorialStatus = EditorialStatus.NOTHING,
    val comments: String = "",
    val createdBy: String?
)
