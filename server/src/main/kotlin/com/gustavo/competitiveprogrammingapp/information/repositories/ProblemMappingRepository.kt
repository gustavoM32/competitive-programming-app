package com.gustavo.competitiveprogrammingapp.information.repositories

import com.gustavo.competitiveprogrammingapp.information.ProblemId
import com.gustavo.competitiveprogrammingapp.information.domain.ProblemMapping
import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.rest.core.annotation.RepositoryRestResource

@RepositoryRestResource
interface ProblemMappingRepository : MongoRepository<ProblemMapping, ProblemId>