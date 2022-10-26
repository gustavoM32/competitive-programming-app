package com.gustavo.competitiveprogrammingapp.information.newInformation.domain

import com.gustavo.competitiveprogrammingapp.information.newInformation.ProblemId
import org.springframework.data.mongodb.core.mapping.Document
import java.time.LocalDateTime

@Document("contestProblems")
data class ContestProblem(
    val problemId: ProblemId,
    val name: String,
    val contestStartTime: LocalDateTime
)