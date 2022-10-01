package com.gustavo.competitiveprogrammingapp.readOnly.cfProblem

import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface CfProblemRepository : MongoRepository<CfProblem, String>
