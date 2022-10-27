package com.gustavo.competitiveprogrammingapp.information.domain

import com.gustavo.competitiveprogrammingapp.information.ProblemId
import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document("problemMappings")
data class ProblemMapping(
    @Id
    val contestProblemId: ProblemId,
    val problemsetProblemId: ProblemId
)
