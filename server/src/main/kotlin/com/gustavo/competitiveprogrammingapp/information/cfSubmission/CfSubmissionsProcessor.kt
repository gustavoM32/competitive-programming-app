package com.gustavo.competitiveprogrammingapp.information.cfSubmission

import com.gustavo.competitiveprogrammingapp.cfApi.CfApiResourceFetcher
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@Component
class CfSubmissionsProcessor(
    private val cfApiResourceFetcher: CfApiResourceFetcher,
    private val repository: CfSubmissionRepository
) {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    fun update(user: String) {
        val userStatus = cfApiResourceFetcher.getUserStatus(user)

        repository.deleteAll() // FIXME: deleting to avoid multiple entries, find a way to not need that

        val cfSubmissions = userStatus.map { s ->
            if (s.problem == null) throw Exception()
            val code = "${s.problem.contestId}${s.problem.index}"

            CfSubmission(
                user = user,
                code = code,
                contestId = s.problem.contestId,
                index = s.problem.index,
                verdict = s.verdict
            )
        }

        repository.saveAll(cfSubmissions)
    }
}