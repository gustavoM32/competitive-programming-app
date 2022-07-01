package com.gustavo.competitiveprogrammingapp.problem

import org.springframework.http.HttpStatus

class ProblemNotFoundException(val statusCode: HttpStatus, val reason: String) : Exception()
