package com.gustavo.competitiveprogrammingapp.information

import java.io.Serializable

data class ProblemId(
    val contestId: Int,
    val index: String
) : Serializable {
    override fun toString(): String {
        return "$contestId$index"
    }
}