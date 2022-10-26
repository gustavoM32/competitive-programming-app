package com.gustavo.competitiveprogrammingapp.information

import com.gustavo.competitiveprogrammingapp.information.processors.CfContestsProcessor
import com.gustavo.competitiveprogrammingapp.information.processors.CfGymContestsProcessor
import com.gustavo.competitiveprogrammingapp.information.processors.CfProblemsProcessor
import com.gustavo.competitiveprogrammingapp.information.processors.UserStatusProcessor
import com.gustavo.competitiveprogrammingapp.information.processors.CfSubmissionsProcessor
import com.gustavo.competitiveprogrammingapp.information.processors.ProblemMappingProcessor
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("info")
class UpdateController(
    val cfProblemsProcessor: CfProblemsProcessor,
    val cfContestsProcessor: CfContestsProcessor,
    val cfGymContestsProcessor: CfGymContestsProcessor,
    val cfSubmissionsProcessor: CfSubmissionsProcessor,
    val userStatusProcessor: UserStatusProcessor,
    val problemMappingProcessor: ProblemMappingProcessor
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
