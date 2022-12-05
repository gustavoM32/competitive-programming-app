package com.gustavo.competitiveprogrammingapp.information

/** Processors update the server database given API resources */
interface Processor {
    /**
     * Updates the information by checking if dependencies should update or are already updated.
     */
    fun update()

    /**
     * Processes the information using the dependent information.
     */
    fun process()

    /**
     * Returns the processed information.
     */
    fun get()

    /**
     * Drops existing information and regenerates it from scratch
     */
    fun reset()
}
