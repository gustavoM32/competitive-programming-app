package com.gustavo.competitiveprogrammingapp.cfApi

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
class CfApi(private val urlCacheRepository: UrlCacheRepository) {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    companion object {
        private const val CODEFORCES_API_URL = "http://codeforces.com/api"
        private val TIME_BETWEEN_REQUESTS = Duration.ofSeconds(2)
        private var lastRequest: LocalDateTime? = null
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

    fun makeCfApiRequest(apiResource: String, cacheTimeTolerance: Duration?): String {
        logger.info("Fetching $apiResource")

        val cacheOptional = urlCacheRepository.findById(apiResource)

        if (cacheOptional.isPresent) {
            val cache = cacheOptional.get()
            val lastResponseTime = cache.responseTime
            logger.info(Duration.between(lastResponseTime, LocalDateTime.now()).toString())
            logger.info(cacheTimeTolerance.toString())
            logger.info((Duration.between(lastResponseTime, LocalDateTime.now()) > cacheTimeTolerance).toString())
            if (cacheTimeTolerance == null || Duration.between(lastResponseTime, LocalDateTime.now()) <= cacheTimeTolerance) {
                logger.info("Got from cache")
                return cache.json
            }
        }

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

        val responseTime = LocalDateTime.now()

        val response = getConnectionResponse(connection)
        logger.info("Got response string")

        urlCacheRepository.save(UrlCache(apiResource, response, responseTime))
        return response
    }
}

