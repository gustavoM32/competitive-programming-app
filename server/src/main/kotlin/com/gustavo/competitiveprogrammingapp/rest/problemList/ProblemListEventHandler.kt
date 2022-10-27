package com.gustavo.competitiveprogrammingapp.rest.problemList

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.data.rest.core.annotation.*
import java.time.LocalDateTime
import java.time.ZoneOffset

@RepositoryEventHandler(ProblemList::class)
class ProblemListEventHandler(private val problemListRepository: ProblemListRepository) {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    @HandleAfterCreate
    fun handleProblemAfterCreate(problemList: ProblemList) {
        problemList.dateAdded = LocalDateTime.now(ZoneOffset.UTC)
        problemListRepository.save(problemList)
    }
}
