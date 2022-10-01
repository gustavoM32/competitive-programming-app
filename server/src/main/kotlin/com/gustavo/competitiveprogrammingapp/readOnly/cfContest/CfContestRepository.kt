package com.gustavo.competitiveprogrammingapp.readOnly.cfContest

import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface CfContestRepository : MongoRepository<CfContest, String>