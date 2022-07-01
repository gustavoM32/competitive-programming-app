package com.gustavo.competitiveprogrammingapp.problem

import org.springframework.data.mongodb.repository.MongoRepository

interface ProblemRepository : MongoRepository<Problem, String>
