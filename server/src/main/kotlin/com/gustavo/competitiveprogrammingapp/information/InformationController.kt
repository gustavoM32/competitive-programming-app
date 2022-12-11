package com.gustavo.competitiveprogrammingapp.information

import com.gustavo.competitiveprogrammingapp.information.domain.CfUser
import com.gustavo.competitiveprogrammingapp.information.processors.*
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("info")
class InformationController(
    val informationService: InformationService,
    val cfContestProcessor: CfContestProcessor,
    val cfGymContestProcessor: CfGymContestProcessor,
    val cfProblemProcessor: CfProblemProcessor,
    val userSubmissionsProcessor: UserSubmissionsProcessor,
    val cfUserProcessor: CfUserProcessor,
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
        return mapOf(Pair("didUpdate", cfContestProcessor.update().didUpdate))
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
        return mapOf(Pair("didUpdate", cfGymContestProcessor.update().didUpdate))
    }

    @GetMapping("cfProblems")
    fun getCfProblems(): Map<String, Any> {
        return mapOf(Pair("resources", cfProblemProcessor.get()), Pair("isUpdating", CfProblemProcessor.isUpdating))
    }

    @GetMapping("cfProblems/update")
    fun updateCfProblems(): Map<String, Any> {
        return mapOf(Pair("didUpdate", cfProblemProcessor.update().didUpdate))
    }

    @GetMapping("cfSubmissions")
    fun getCfSubmissions(@RequestParam handle: String): Map<String, Any> {
        return mapOf(
            Pair("resources", userSubmissionsProcessor.get(handle)),
            Pair("isUpdating", userSubmissionsProcessor.isUpdating(handle))
        )
    }

    @GetMapping("cfSubmissions/update")
    fun updateCfSubmissions(@RequestParam handle: String): Map<String, Any> {
        return mapOf(Pair("didUpdate", userSubmissionsProcessor.update(handle).didUpdate))
    }

    @GetMapping("cfUser")
    fun getCfUser(@RequestParam handle: String): Map<String, Any> {
        val cfUser: CfUser?

        try {
            cfUser = cfUserProcessor.get(handle)
        } catch (e: Exception) {
            return mapOf(
                Pair("resources", emptyList<CfUser>()),
                Pair("isUpdating", cfUserProcessor.isUpdating(handle))
            )
        }

        return mapOf(
            Pair("resources", listOf(cfUser)),
            Pair("isUpdating", cfUserProcessor.isUpdating(handle))
        )
    }

    @GetMapping("cfUser/update")
    fun updateCfUser(@RequestParam handle: String): Map<String, Any> {
        return mapOf(Pair("didUpdate", cfUserProcessor.update(handle).didUpdate))
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
        return mapOf(Pair("didUpdate", userStatusProcessor.update(handle).didUpdate))
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
        return mapOf(Pair("didUpdate", userStatusProcessor.update(handle).didUpdate))
    }


    @GetMapping("dropCache")
    fun dropCache(): String {
        cfContestProcessor.reset()
        cfGymContestProcessor.reset()
        cfProblemProcessor.reset()
        cfUserProcessor.reset()
        contestProblemProcessor.reset()
        problemMappingProcessor.reset()
        userSubmissionsProcessor.reset()
        userStatusProcessor.reset()
        informationService.deleteAll()
        return "OK"
    }
}
