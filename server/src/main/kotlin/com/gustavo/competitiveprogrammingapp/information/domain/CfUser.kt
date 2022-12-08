package com.gustavo.competitiveprogrammingapp.information.domain

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document

@Document("cfUsers")
data class CfUser(
    @Id
    val handle: String,
    val firstName: String?,
    val lastName: String?,
    val rating: Int?,
    val maxRating: Int?
)