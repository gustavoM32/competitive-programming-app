package com.gustavo.competitiveprogrammingapp.processors

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("info")
class InformationProcessorController(
    val cfProblemsProcessor: CfProblemsProcessor,
    val cfContestsProcessor: CfContestsProcessor,
    val cfGymContestsProcessor: CfGymContestsProcessor,
    val cfSubmissionsProcessor: CfSubmissionsProcessor
    ) {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    @GetMapping("cfProblems")
    fun getCfProblems(): String {
        cfProblemsProcessor.update()
        return "OK"
    }

    @GetMapping("cfContests")
    fun getCfContests(): String {
        cfContestsProcessor.update()
        return "OK"
    }

    @GetMapping("cfGymContests")
    fun getCfGymContests(): String {
        cfGymContestsProcessor.update()
        return "OK"
    }

    @GetMapping("cfSubmissions")
    fun getCfSubmissions(): String {
        val user = "gustavo_m32" // TODO: get user from request
        cfSubmissionsProcessor.update(user)
        return "OK"
    }
}
