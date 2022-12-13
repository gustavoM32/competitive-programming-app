package com.gustavo.competitiveprogrammingapp.information.domain

import com.gustavo.competitiveprogrammingapp.information.ProblemId
import com.gustavo.competitiveprogrammingapp.rest.problem.ProblemStatusEnum
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document("userProblemStatus")
data class UserProblemStatus(
    @Id
    val user: String,
    val problemsStatus: List<ProblemStatus>
)

data class ProblemStatus(
    val problemId: ProblemId,
    val problemStatus: ProblemStatusEnum,
    val contestStatus: ContestStatusEnum
)
