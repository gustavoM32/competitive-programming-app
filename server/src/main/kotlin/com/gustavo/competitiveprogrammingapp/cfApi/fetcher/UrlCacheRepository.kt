package com.gustavo.competitiveprogrammingapp.cfApi.fetcher

import org.springframework.data.mongodb.repository.MongoRepository
import org.springframework.stereotype.Repository

@Repository
interface UrlCacheRepository : MongoRepository<UrlCache, String>
