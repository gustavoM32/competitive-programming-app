package com.gustavo.competitiveprogrammingapp.rest.problemList

import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface ProblemListRepository : MongoRepository<ProblemList, String>
