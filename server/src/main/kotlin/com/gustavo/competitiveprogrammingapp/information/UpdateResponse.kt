package com.gustavo.competitiveprogrammingapp.information

import java.time.LocalDateTime

data class UpdateResponse(
    val didUpdate: Boolean,
    val lastUpdate: LocalDateTime
)