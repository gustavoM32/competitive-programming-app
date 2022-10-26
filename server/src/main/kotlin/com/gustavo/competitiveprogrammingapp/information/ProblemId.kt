package com.gustavo.competitiveprogrammingapp.information

data class ProblemId(
    val contestId: Int,
    val index: String
) {
    override fun toString(): String {
        return "$contestId$index"
    }
}