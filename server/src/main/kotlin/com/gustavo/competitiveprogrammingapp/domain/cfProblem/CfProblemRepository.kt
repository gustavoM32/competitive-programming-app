package com.gustavo.competitiveprogrammingapp.domain.cfProblem

import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.mongodb.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface CfProblemRepository : MongoRepository<CfProblem, String>
