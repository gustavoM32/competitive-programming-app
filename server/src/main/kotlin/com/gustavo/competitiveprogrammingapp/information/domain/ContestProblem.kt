package com.gustavo.competitiveprogrammingapp.information.domain

import com.gustavo.competitiveprogrammingapp.information.ProblemId
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

@Document("contestProblems")
data class ContestProblem(
    val problemId: ProblemId,
    val name: String,
    val contestStartTime: LocalDateTime
)