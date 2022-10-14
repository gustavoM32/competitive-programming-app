package com.gustavo.competitiveprogrammingapp.util

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.time.Duration
import java.time.LocalDateTime

class Timer(private var msg: String = "timer") {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    var startTime: LocalDateTime? = null

    fun start() {
        startTime = LocalDateTime.now()
    }

    fun stop() {
        val endTime = LocalDateTime.now()
        val dur = Duration.between(startTime, endTime).toString()
        logger.info("$msg: $dur")
    }

    init {
        start()
    }
}
