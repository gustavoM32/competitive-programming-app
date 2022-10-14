package com.gustavo.competitiveprogrammingapp.readOnly.cfSubmission

import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface CfSubmissionRepository : MongoRepository<CfSubmission, String> {
    fun findByUser(user: String): List<CfSubmission>
}
