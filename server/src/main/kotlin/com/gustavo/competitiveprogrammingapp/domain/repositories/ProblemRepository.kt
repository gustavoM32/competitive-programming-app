package com.gustavo.competitiveprogrammingapp.problem

import com.gustavo.competitiveprogrammingapp.domain.problem.Problem
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface ProblemRepository : MongoRepository<Problem, String>
