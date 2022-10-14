package com.gustavo.competitiveprogrammingapp.rest.problem

import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface ProblemRepository : MongoRepository<Problem, String>
