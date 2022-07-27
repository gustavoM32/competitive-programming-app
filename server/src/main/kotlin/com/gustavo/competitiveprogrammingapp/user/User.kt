package com.gustavo.competitiveprogrammingapp.user

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.Field

@Document("users")
data class User (
    @Id
    val id: String? = null,
    @Field("username")
    val username: String?,
    @Field("password")
    val password: String,
    @Field("role")
    val role: String
)
