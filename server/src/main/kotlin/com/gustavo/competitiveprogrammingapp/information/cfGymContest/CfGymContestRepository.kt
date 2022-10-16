package com.gustavo.competitiveprogrammingapp.information.cfGymContest

import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.rest.core.annotation.RepositoryRestResource

@RepositoryRestResource
interface CfGymContestRepository : MongoRepository<CfGymContest, Int>