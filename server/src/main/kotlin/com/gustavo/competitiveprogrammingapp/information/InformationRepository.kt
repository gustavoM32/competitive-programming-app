package com.gustavo.competitiveprogrammingapp.information

import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.data.rest.core.annotation.RepositoryRestResource

@RepositoryRestResource
interface InformationRepository : MongoRepository<Information, String>