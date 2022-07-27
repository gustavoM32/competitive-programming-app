package com.gustavo.competitiveprogrammingapp.problem.desnecessario

import com.gustavo.competitiveprogrammingapp.domain.problem.Problem
import com.gustavo.competitiveprogrammingapp.problem.ProblemRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service

@Service
class ProblemService(private val problemRepository: ProblemRepository) {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)
    fun getAllProblems(): List<Problem> {
        logger.info("MERDA")
        return problemRepository.findAll()
    }

    fun getProblemById(problemId: String): Problem
        = problemRepository.findById(problemId)
        .orElseThrow{ ProblemNotFoundException(HttpStatus.NOT_FOUND, "No matching problem was found") }

    fun createProblem(problem: Problem): Problem
        = problemRepository.save(problem)

    fun updateProblemById(problemId: String, problem: Problem): Problem {
        return if (problemRepository.existsById(problemId)) {
            problemRepository.save(
                Problem(
                    id = problem.id,
                    link = problem.link,
                    dateAdded = problem.dateAdded,
                    name = problem.name,
                    problemStatus = problem.problemStatus,
                    editorialStatus = problem.editorialStatus,
                    comments = problem.comments
                )
            )
        } else throw ProblemNotFoundException(HttpStatus.NOT_FOUND, "No matching problem was found")
    }

    fun deleteProblemById(problemId: String) {
        return if (problemRepository.existsById(problemId)) {
            problemRepository.deleteById(problemId)
        } else throw ProblemNotFoundException(HttpStatus.NOT_FOUND, "No matching problem was found")
    }
}