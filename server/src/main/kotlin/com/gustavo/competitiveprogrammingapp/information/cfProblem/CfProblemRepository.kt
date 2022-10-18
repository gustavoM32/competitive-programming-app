package com.gustavo.competitiveprogrammingapp.information.cfProblem

import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Slice
import org.springframework.data.mongodb.repository.Aggregation
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface CfProblemRepository : MongoRepository<CfProblem, String>
