package com.gustavo.competitiveprogrammingapp.cfApi

import com.google.gson.Gson
import com.google.gson.JsonElement
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.io.BufferedReader
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import java.time.Duration
import java.time.LocalDateTime
import java.util.*

/**
 * The Fetcher provides an interface to Codeforces API requests. It handles the parsing and caching of the API JSON
 * response, and limits the number of requests to comply with the API limit.
 */
@Component
class Fetcher(private val urlCacheRepository: UrlCacheRepository) {
    companion object {
        private const val CODEFORCES_API_URL = "http://codeforces.com/api"
        private val TIME_BETWEEN_REQUESTS = Duration.ofSeconds(2)
        private var lastRequest: LocalDateTime? = null
    }

    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    private data class ApiResponse(
        val status: String? = null,
        val result: JsonElement? = null
    )

    /** Returns true if a fetch would result in an API call given the time tolerance. */
    fun willFetch(apiResource: String, cacheTimeTolerance: Duration?): Boolean {
        val cacheOptional = urlCacheRepository.findById(apiResource)

        return cacheOptional.isEmpty || !shouldGetFromCache(cacheOptional.get().lastUpdate, cacheTimeTolerance)
    }

    /** Returns a Codeforces API resource. It checks the cache and gets the cached response from it if it is within the
     * given time tolerance. It fetches the data from the API otherwise. */
    fun <T> getResource(apiResource: String, resourceClass: Class<T>, cacheTimeTolerance: Duration?): T {
        logger.info("Get resource $apiResource")

        val cachedResource = getFromCache(apiResource, resourceClass, cacheTimeTolerance)

        if (cachedResource.isPresent) return cachedResource.get()

        val response = makeCfApiRequest(apiResource)
        logger.info("Got response string")

        val gsonResponse = Gson().fromJson(response, ApiResponse::class.java)
        logger.info("Got response gson")

        if (gsonResponse.status == null || gsonResponse.status != "OK") {
            throw Exception("Response status is not 'OK'")
        }

        if (gsonResponse.result == null) {
            throw Exception("Result is null")
        }

        val resource = Gson().fromJson(gsonResponse.result, resourceClass)
        // The parsed resource is converted to a string again so that only the necessary data is stored. This lowers the
        // memory consumption, but invalidates the cache if the domain changes.
        val cache = Gson().toJson(resource)

        logger.info("Got cache string")
        urlCacheRepository.save(
            UrlCache(
                apiResource,
                json = cache,
                lastUpdate = LocalDateTime.now()
            )
        )
        logger.info("Saved to cache")

        return resource
    }

    /** Returns a cached resource if its last update is within the given time tolerance.
     * Returns an empty optional otherwise.
     */
    private fun <T> getFromCache(
        apiResource: String,
        resourceClass: Class<T>,
        cacheTimeTolerance: Duration?
    ): Optional<T> {
        return urlCacheRepository
            .findById(apiResource)
            .flatMap a@{ cache ->
                if (shouldGetFromCache(cache.lastUpdate, cacheTimeTolerance)) {
                    val cachedResource = Gson().fromJson(cache.json, resourceClass)
                    if (cachedResource != null) {
                        logger.info("Got from cache (last update ${cache.lastUpdate} is within tolerance ${cacheTimeTolerance})")
                        return@a Optional.of(cachedResource)
                    } else {
                        return@a Optional.empty()
                    }
                }

                return@a Optional.empty()
            }
    }

    /** Returns true if the cached resource is outside the given time tolerance. */
    private fun shouldGetFromCache(lastUpdate: LocalDateTime, cacheTimeTolerance: Duration?): Boolean {
        return cacheTimeTolerance == null || Duration.between(
            lastUpdate,
            LocalDateTime.now()
        ) <= cacheTimeTolerance
    }

    /** Makes the actual call to the API and returns the response String. It tries to obey the API request rate limit.
     */
    private fun makeCfApiRequest(apiResource: String): String {
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

    /** Returns the connection response as a String. */
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
