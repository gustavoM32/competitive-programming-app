package com.gustavo.competitiveprogrammingapp.domain.problemList

import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface ProblemListRepository : MongoRepository<ProblemList, String>
