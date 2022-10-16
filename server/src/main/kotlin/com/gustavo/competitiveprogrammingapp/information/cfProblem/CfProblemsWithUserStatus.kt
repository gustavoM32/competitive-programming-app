package com.gustavo.competitiveprogrammingapp.information.cfProblem

import com.gustavo.competitiveprogrammingapp.information.cfSubmission.CfSubmission
import org.springframework.data.annotation.Id

data class CfProblemsWithUserStatus(
    @Id
    val code: String? = null,
    val contestId: Int?,
    val index: String?,
    val name: String?,
    val rating: Int?,
    val submissions: List<CfSubmission>?
)