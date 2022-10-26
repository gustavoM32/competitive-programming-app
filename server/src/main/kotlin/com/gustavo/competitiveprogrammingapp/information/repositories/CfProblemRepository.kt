package com.gustavo.competitiveprogrammingapp.information.repositories

import com.gustavo.competitiveprogrammingapp.information.ProblemId
import com.gustavo.competitiveprogrammingapp.information.domain.CfProblem
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface CfProblemRepository : MongoRepository<CfProblem, ProblemId>
