package com.gustavo.competitiveprogrammingapp.util

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.time.Duration
import java.time.LocalDateTime

class Timer(private var msg: String = "timer") {
    private var checkNum = 1;

    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    private var startTime: LocalDateTime? = null
    private var checkTime: LocalDateTime? = null

    private fun start() {
        startTime = LocalDateTime.now()
        checkTime = startTime
    }

    fun check(name: String?) {
        val now = LocalDateTime.now()
        val checkDur = Duration.between(checkTime, now).toString()
        val totalDur = Duration.between(startTime, now).toString()
        logger.info("$msg - check $checkNum ($name) $checkDur     Total: $totalDur")

        checkTime = now
        checkNum += 1
    }

    fun stop() {
        val endTime = LocalDateTime.now()
        val dur = Duration.between(startTime, endTime).toString()
        logger.info("$msg $dur")
    }

    init {
        start()
    }
}
