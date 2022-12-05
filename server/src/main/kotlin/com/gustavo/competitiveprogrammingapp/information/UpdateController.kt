package com.gustavo.competitiveprogrammingapp.information

import com.gustavo.competitiveprogrammingapp.information.processors.CfContestProcessor
import com.gustavo.competitiveprogrammingapp.information.processors.CfGymContestProcessor
import com.gustavo.competitiveprogrammingapp.information.processors.CfProblemProcessor
import com.gustavo.competitiveprogrammingapp.information.processors.UserStatusProcessor
import com.gustavo.competitiveprogrammingapp.information.processors.CfSubmissionProcessor
import com.gustavo.competitiveprogrammingapp.information.processors.ProblemMappingProcessor
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("info")
class UpdateController(
    val cfProblemProcessor: CfProblemProcessor,
    val cfContestProcessor: CfContestProcessor,
    val cfGymContestProcessor: CfGymContestProcessor,
    val cfSubmissionProcessor: CfSubmissionProcessor,
    val userStatusProcessor: UserStatusProcessor,
    val problemMappingProcessor: ProblemMappingProcessor
) {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    @GetMapping("cfProblems")
    fun getCfProblems(): String {
        cfProblemProcessor.update()
        return "OK"
    }

    @GetMapping("cfContests")
    fun getCfContests(): String {
        cfContestProcessor.update()
        return "OK"
    }

    @GetMapping("cfGymContests")
    fun getCfGymContests(): String {
        cfGymContestProcessor.update()
        return "OK"
    }

    @GetMapping("cfSubmissions")
    fun getCfSubmissions(@RequestParam handle: String): String {
        cfSubmissionProcessor.update(handle)
        return "OK"
    }

    @GetMapping("userStatus")
    fun getUserStatus(@RequestParam handle: String): String {
        userStatusProcessor.update(handle)
        return "OK"
    }
        return "OK"
    }
}
