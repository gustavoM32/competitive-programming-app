package com.gustavo.competitiveprogrammingapp.readOnly.cfProblem

import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Slice
import org.springframework.data.mongodb.repository.Aggregation
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface CfProblemRepository : MongoRepository<CfProblem, String> {
    @Aggregation(pipeline = [
        "{ \$lookup: { from: 'cfSubmissions', localField: '_id', foreignField: 'code', as: 'submissions' } }"
    ])
    fun findWithUserStatus(pageable: Pageable): Slice<CfProblemsWithUserStatus>
}

