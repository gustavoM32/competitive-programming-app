package com.gustavo.competitiveprogrammingapp.information

import com.gustavo.competitiveprogrammingapp.information.processors.*
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("info")
class UpdateController(
    val cfContestProcessor: CfContestProcessor,
    val cfGymContestProcessor: CfGymContestProcessor,
    val cfProblemProcessor: CfProblemProcessor,
    val cfSubmissionProcessor: CfSubmissionProcessor,
    val contestProblemProcessor: ContestProblemProcessor,
    val problemMappingProcessor: ProblemMappingProcessor,
    val userStatusProcessor: UserStatusProcessor
) {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

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

    @GetMapping("cfProblems")
    fun getCfProblems(): String {
        cfProblemProcessor.update()
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

    @GetMapping("dropCache")
    fun dropCache(): String {
        cfContestProcessor.reset()
        cfGymContestProcessor.reset()
        cfProblemProcessor.reset()
        contestProblemProcessor.reset()
        problemMappingProcessor.reset()
        cfSubmissionProcessor.reset()
        userStatusProcessor.reset()
        return "OK"
    }
}
