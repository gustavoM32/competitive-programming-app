package com.gustavo.competitiveprogrammingapp.problem.desnecessario

import com.gustavo.competitiveprogrammingapp.domain.problem.Problem
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*

@RestController
//@CrossOrigin("*", "3600")
class ProblemController(private val problemService: ProblemService) {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)
    // TODO PQ DIABOS FUNCIONA SE EU TIRAR TUDO ISSO
    @GetMapping("/olarar")
    fun afff(): String {
        logger.info("AAAAAAAAAAAA")
        return ""
    }

    @GetMapping("/problems")
    fun getAllProblems(): List<Problem>
        = problemService.getAllProblems()

    @GetMapping("/problems/{id}")
    fun getProblemById(@PathVariable("id") problemId: String): Problem {
        logger.info("AQUIRA")
        return problemService.getProblemById(problemId)
    }

    @PostMapping("/problems")
    fun createProblem(@RequestBody payload: Problem): Problem
        = problemService.createProblem(payload)

    @PutMapping("/problems/{id}")
    fun updateProblemById(@PathVariable("id") problemId: String, @RequestBody payload: Problem): Problem {
        logger.info("AQUIR")
        logger.info(payload.toString())
        return problemService.updateProblemById(problemId, payload)
    }

    @DeleteMapping("/problems/{id}")
    fun deleteProblemById(@PathVariable("id") problemId: String): Unit
        = problemService.deleteProblemById(problemId)
}