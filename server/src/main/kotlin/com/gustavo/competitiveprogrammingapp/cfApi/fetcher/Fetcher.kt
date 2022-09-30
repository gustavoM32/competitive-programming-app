package com.gustavo.competitiveprogrammingapp.cfApi.fetcher

import com.google.gson.Gson
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import java.time.Duration
import java.time.LocalDateTime

@Component
class Fetcher(private val urlCacheRepository: UrlCacheRepository) {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    companion object {
        private const val CODEFORCES_API_URL = "http://codeforces.com/api"
        private val TIME_BETWEEN_REQUESTS = Duration.ofSeconds(2)
        private var lastRequest: LocalDateTime? = null
    }

    fun <T> getResource(apiResource: String, resourceClass: Class<T>, cacheTimeTolerance: Duration?): T {
        val cacheOptional = urlCacheRepository.findById(apiResource)
        logger.info("Get resource $apiResource")

        if (cacheOptional.isPresent) {
            val cache = cacheOptional.get()
            val lastResponseTime = cache.responseTime
            logger.info(Duration.between(lastResponseTime, LocalDateTime.now()).toString())
            if (cacheTimeTolerance == null || Duration.between(lastResponseTime, LocalDateTime.now()) <= cacheTimeTolerance) {
                logger.info("Got from cache")
                return Gson().fromJson(cache.json, resourceClass)
            }
        }

        val response = makeCfApiRequest(apiResource)
        logger.info("Got response string")

        val gsonResponse = Gson().fromJson(response, ApiResult::class.java)
        logger.info("Got response gson")

        if (gsonResponse.status == null || gsonResponse.status != "OK") {
            throw Exception("Response status is not 'OK'")
        }

        if (gsonResponse.result == null) {
            throw Exception("Result is null")
        }

        val resource = Gson().fromJson(gsonResponse.result, resourceClass)
        val cache = Gson().toJson(resource)

        logger.info("Got cache string")
        urlCacheRepository.save(UrlCache(apiResource, cache, LocalDateTime.now()))
        logger.info("Saved to cache")

        return resource
    }

    fun makeCfApiRequest(apiResource: String): String {
        logger.info("Fetching $apiResource")

        while (lastRequest != null && Duration.between(lastRequest, LocalDateTime.now()) < TIME_BETWEEN_REQUESTS) {
            Thread.sleep(1000)
        }

        lastRequest = LocalDateTime.now()

        val url = URL("$CODEFORCES_API_URL$apiResource")

        val connection = url.openConnection() as HttpURLConnection
        connection.requestMethod = "GET"
        connection.connect()

        val responseCode = connection.responseCode
        logger.info("Response $responseCode")

        if (responseCode != 200) {
            throw Exception("Response code was not 200")
        }

        return getConnectionResponse(connection)
    }

    private fun getConnectionResponse(connection: HttpURLConnection): String {
        val responseContent = StringBuilder()
        val reader = BufferedReader(InputStreamReader(connection.inputStream))

        reader.forEachLine {
            responseContent.append(it)
        }
        reader.close()

        return responseContent.toString()
    }
}
