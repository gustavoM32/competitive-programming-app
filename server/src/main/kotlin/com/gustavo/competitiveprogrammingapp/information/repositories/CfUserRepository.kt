package com.gustavo.competitiveprogrammingapp.information.repositories

import com.gustavo.competitiveprogrammingapp.information.domain.CfUser
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface CfUserRepository : MongoRepository<CfUser, String>