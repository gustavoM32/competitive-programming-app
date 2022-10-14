package com.gustavo.competitiveprogrammingapp.cfApi

import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface UrlCacheRepository : MongoRepository<UrlCache, String>
