package com.gustavo.competitiveprogrammingapp.rest.problem

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.data.rest.core.annotation.*
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneOffset

@RepositoryEventHandler(Problem::class)
class ProblemEventHandler(private val problemRepository: ProblemRepository) {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    @HandleAfterCreate
    fun handleProblemAfterCreate(problem: Problem) {
        problem.dateAdded = LocalDateTime.now(ZoneOffset.UTC)
        problemRepository.save(problem)
    }
}
