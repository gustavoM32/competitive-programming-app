package com.gustavo.competitiveprogrammingapp.problem

import org.springframework.web.bind.annotation.*

@RestController
class ProblemController(private val problemService: ProblemService) {
    @GetMapping("/problems")
    fun getAllProblems(): List<Problem>
        = problemService.getAllProblems()

    @GetMapping("/problems/{id}")
    fun getProblemById(@PathVariable("id") problemId: String): Problem
        = problemService.getProblemById(problemId)

    @PostMapping("/problems")
    fun createProblem(@RequestBody payload: Problem): Problem
        = problemService.createProblem(payload)

    @PutMapping("/problems/{id}")
    fun updateProblemById(@PathVariable("id") problemId: String, @RequestBody payload: Problem): Problem
        = problemService.updateProblemById(problemId, payload)

    @DeleteMapping("/problems/{id}")
    fun deleteProblemById(@PathVariable("id") problemId: String): Unit
        = problemService.deleteProblemById(problemId)
}