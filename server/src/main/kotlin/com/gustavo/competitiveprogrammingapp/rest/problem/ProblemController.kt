package com.gustavo.competitiveprogrammingapp.rest.problem

import com.gustavo.competitiveprogrammingapp.information.repositories.CfProblemRepository
import com.gustavo.competitiveprogrammingapp.information.deprecated.CfProblemsWithUserStatus
import com.gustavo.competitiveprogrammingapp.information.repositories.CfSubmissionRepository
import com.gustavo.competitiveprogrammingapp.rest.problem.ProblemStatus
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Slice
import org.springframework.data.domain.SliceImpl
import org.springframework.hateoas.Link
import org.springframework.hateoas.PagedModel
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder
import org.springframework.hateoas.server.mvc.linkTo
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import kotlin.math.min

@RestController
@RequestMapping("api")
class ProblemController(val problemRepository: ProblemRepository) {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

}