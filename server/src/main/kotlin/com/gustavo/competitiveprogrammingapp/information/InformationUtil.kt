package com.gustavo.competitiveprogrammingapp.information

import java.time.Duration
import java.time.LocalDateTime

class InformationUtil {
    companion object {
        fun shouldInformationReprocess(infoLastUpdate: LocalDateTime, apiLastUpdate: LocalDateTime, cacheTolerance: Duration): Boolean {
            return infoLastUpdate < apiLastUpdate || Duration.between(apiLastUpdate, LocalDateTime.now()) > cacheTolerance
        }
    }
}