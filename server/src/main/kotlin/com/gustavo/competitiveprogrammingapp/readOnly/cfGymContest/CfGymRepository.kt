package com.gustavo.competitiveprogrammingapp.readOnly.cfGymContest

import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.rest.core.annotation.RepositoryRestResource

@RepositoryRestResource
interface CfGymRepository : MongoRepository<CfGym, Int>