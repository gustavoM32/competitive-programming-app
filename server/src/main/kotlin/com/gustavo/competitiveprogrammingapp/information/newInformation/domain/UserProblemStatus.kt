package com.gustavo.competitiveprogrammingapp.information.newInformation.domain

import com.gustavo.competitiveprogrammingapp.information.newInformation.ProblemId
import com.gustavo.competitiveprogrammingapp.rest.problem.ProblemStatus
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document("userProblemStatus")
data class UserProblemStatus(
    @Id
    val problemId: ProblemId,
    val user: String,
    val problemStatus: ProblemStatus,
    val contestStatus: ContestStatus
)
