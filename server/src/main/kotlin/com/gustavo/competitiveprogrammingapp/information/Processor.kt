package com.gustavo.competitiveprogrammingapp.information

import org.springframework.data.mongodb.repository.MongoRepository

/** Processors update the server database given API resources */
interface Processor {
    /**
     * Updates the information, ignores information that is not expected to change.
     */
    fun update()

    /**
     * Drops existing information and regenerates it from scratch
     */
    fun reset()
}