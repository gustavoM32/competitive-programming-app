package com.gustavo.competitiveprogrammingapp.information

import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class InformationService(val repository: InformationRepository) {
    fun doesNotExist(id: String): Boolean {
        return !repository.existsById(id)
    }

    fun update(id: String) {
        repository.save(Information(id, LocalDateTime.now()))
    }

    fun getLastUpdate(id: String): LocalDateTime {
        // If is not updated ever, return the oldest LocalDateTime possible.
        return repository.findById(id).map { it.lastUpdate }.orElse(LocalDateTime.MIN)
    }

    fun delete(id: String) {
        repository.deleteById(id)
    }

    fun deleteAll() {
        repository.deleteAll()
    }
}