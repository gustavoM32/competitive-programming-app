package com.gustavo.competitiveprogrammingapp.domain.cfContest

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.Field

@Document("cfContests")
data class CfContest(
    @Id
    val id: Int? = null,
    @Field(name = "name")
    val name: String?,
)
