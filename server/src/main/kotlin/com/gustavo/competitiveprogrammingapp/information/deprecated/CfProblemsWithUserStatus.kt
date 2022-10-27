package com.gustavo.competitiveprogrammingapp.information.deprecated

import com.gustavo.competitiveprogrammingapp.rest.problem.ProblemStatus
import org.springframework.data.annotation.Id

data class CfProblemsWithUserStatus(
    @Id
    val code: String? = null,
    val contestId: Int?,
    val index: String?,
    val name: String?,
    val rating: Int?,
    val user: String?,
    val userStatus: ProblemStatus?
)
