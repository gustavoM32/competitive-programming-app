package com.gustavo.competitiveprogrammingapp.information.newInformation.domain

import com.gustavo.competitiveprogrammingapp.information.newInformation.ProblemId
import com.gustavo.competitiveprogrammingapp.rest.problem.ProblemStatus
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document("problemMappings")
data class ProblemMapping(
    @Id
    val contestProblemId: ProblemId,
    val problemsetProblemId: ProblemId
)
