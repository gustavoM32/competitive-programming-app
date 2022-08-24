package com.gustavo.competitiveprogrammingapp.problem

import com.gustavo.competitiveprogrammingapp.domain.problemList.ProblemList
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface ProblemListRepository : MongoRepository<ProblemList, String>
