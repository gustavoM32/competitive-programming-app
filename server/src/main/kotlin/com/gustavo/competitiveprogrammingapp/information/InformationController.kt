package com.gustavo.competitiveprogrammingapp.information

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("info")
class InformationController(
    val problemsetProblemsProcessor: ProblemsetProblemsProcessor,
    val contestsProcessor: ContestsProcessor
    ) {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    @GetMapping("problemsetProblems")
    fun getProblemsetProblems(): String {
        problemsetProblemsProcessor.update()
        return "OK"
    }

    @GetMapping("contests")
    fun getContests(): String {
        contestsProcessor.update()
        return "OK"
    }
}
