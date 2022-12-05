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

    fun delete(id: String) {
        repository.deleteById(id)
    }

    fun deleteAll() {
        repository.deleteAll()
    }
}