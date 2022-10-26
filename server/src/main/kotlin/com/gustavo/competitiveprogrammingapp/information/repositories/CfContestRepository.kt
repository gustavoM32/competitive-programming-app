package com.gustavo.competitiveprogrammingapp.information.repositories

import com.gustavo.competitiveprogrammingapp.information.domain.CfContest
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.rest.core.annotation.RepositoryRestResource

@RepositoryRestResource
interface CfContestRepository : MongoRepository<CfContest, Int>