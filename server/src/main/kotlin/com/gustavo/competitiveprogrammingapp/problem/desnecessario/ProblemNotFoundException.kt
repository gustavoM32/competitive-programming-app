package com.gustavo.competitiveprogrammingapp.problem.desnecessario

import org.springframework.http.HttpStatus

class ProblemNotFoundException(val statusCode: HttpStatus, val reason: String) : Exception()
