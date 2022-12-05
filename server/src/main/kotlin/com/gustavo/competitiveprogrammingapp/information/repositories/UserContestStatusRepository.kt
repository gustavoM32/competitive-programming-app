package com.gustavo.competitiveprogrammingapp.information.repositories

import com.gustavo.competitiveprogrammingapp.information.domain.UserContestStatus
import com.gustavo.competitiveprogrammingapp.information.domain.UserProblemStatus
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.rest.core.annotation.RepositoryRestResource

@RepositoryRestResource
interface UserContestStatusRepository : MongoRepository<UserContestStatus, Int> {
    fun findByUser(user: String): List<UserContestStatus>
}