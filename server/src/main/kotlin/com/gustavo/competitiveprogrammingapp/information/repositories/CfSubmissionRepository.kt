package com.gustavo.competitiveprogrammingapp.information.repositories

import com.gustavo.competitiveprogrammingapp.information.domain.CfSubmission
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface CfSubmissionRepository : MongoRepository<CfSubmission, String> {
    fun findByUser(user: String): List<CfSubmission>
}
