package com.gustavo.competitiveprogrammingapp.information.cfContest

import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.rest.core.annotation.RepositoryRestResource

@RepositoryRestResource
interface CfContestRepository : MongoRepository<CfContest, Int>