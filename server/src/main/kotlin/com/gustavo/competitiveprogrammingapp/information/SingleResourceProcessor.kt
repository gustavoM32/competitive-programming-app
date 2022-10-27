package com.gustavo.competitiveprogrammingapp.information

import org.springframework.data.mongodb.repository.MongoRepository

/** Processor for a single resource */
interface SingleResourceProcessor<T, K> : Processor {
    val repository: MongoRepository<T, K>

    fun updateAndFindAll(): List<T> {
        update()
        return repository.findAll()
    }

    override fun reset() {
        repository.deleteAll()
        update()
    }
}
