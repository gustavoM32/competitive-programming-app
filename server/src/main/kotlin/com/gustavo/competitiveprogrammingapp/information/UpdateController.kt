package com.gustavo.competitiveprogrammingapp.information

import com.gustavo.competitiveprogrammingapp.information.domain.CfContest
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
    val informationService: InformationService,
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
    fun getCfContests(): Map<String, Any> {
        return mapOf(Pair("resources", cfContestProcessor.get()), Pair("isUpdating", CfContestProcessor.isUpdating))
    }

    @GetMapping("cfContests/update")
    fun updateCfContests(): Map<String, Any> {
        return mapOf(Pair("didUpdate", cfContestProcessor.update()))
    }

    @GetMapping("cfGymContests")
    fun getCfGymContests(): Map<String, Any> {
        return mapOf(
            Pair("resources", cfGymContestProcessor.get()),
            Pair("isUpdating", CfGymContestProcessor.isUpdating)
        )
    }

    @GetMapping("cfGymContests/update")
    fun updateCfGymContests(): Map<String, Any> {
        return mapOf(Pair("didUpdate", cfGymContestProcessor.update()))
    }

    @GetMapping("cfProblems")
    fun getCfProblems(): Map<String, Any> {
        return mapOf(Pair("resources", cfProblemProcessor.get()), Pair("isUpdating", CfProblemProcessor.isUpdating))
    }

    @GetMapping("cfProblems/update")
    fun updateCfProblems(): Map<String, Any> {
        return mapOf(Pair("didUpdate", cfProblemProcessor.update()))
    }

    @GetMapping("cfSubmissions")
    fun getCfSubmissions(@RequestParam handle: String): Map<String, Any> {
        return mapOf(
            Pair("resources", cfSubmissionProcessor.get(handle)),
            Pair("isUpdating", cfSubmissionProcessor.isUpdating(handle))
        )
    }

    @GetMapping("cfSubmissions/update")
    fun updateCfSubmissions(@RequestParam handle: String): Map<String, Any> {
        return mapOf(Pair("didUpdate", cfSubmissionProcessor.update(handle)))
    }

    @GetMapping("userProblemStatus")
    fun getUserProblemStatus(@RequestParam handle: String): Map<String, Any> {
        return mapOf(
            Pair("resources", userStatusProcessor.getProblemStatus(handle)),
            Pair("isUpdating", userStatusProcessor.isUpdating(handle))
        )
    }

    @GetMapping("userProblemStatus/update")
    fun updateUserProblemStatus(@RequestParam handle: String): Map<String, Any> {
        return mapOf(Pair("didUpdate", userStatusProcessor.update(handle)))
    }

    @GetMapping("userContestStatus")
    fun getUserContestStatus(@RequestParam handle: String): Map<String, Any> {
        return mapOf(
            Pair("resources", userStatusProcessor.getContestStatus(handle)),
            Pair("isUpdating", userStatusProcessor.isUpdating(handle))
        )
    }

    @GetMapping("userContestStatus/update")
    fun updateUserContestStatus(@RequestParam handle: String): Map<String, Any> {
        return mapOf(Pair("didUpdate", userStatusProcessor.update(handle)))
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
        informationService.deleteAll()
        return "OK"
    }
}
