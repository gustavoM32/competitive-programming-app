package com.gustavo.competitiveprogrammingapp.information.domain

import com.gustavo.competitiveprogrammingapp.information.ProblemId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document("cfProblems")
data class CfProblem(
    @Id
    val problemId: ProblemId,
    val name: String,
    val rating: Int?,
)
