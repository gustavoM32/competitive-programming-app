package com.gustavo.competitiveprogrammingapp.information.cfSubmission

import com.gustavo.competitiveprogrammingapp.cfApi.CfApiResourceFetcher
import com.gustavo.competitiveprogrammingapp.information.newInformation.ProblemId
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

        val cfSubmissions = userStatus.mapNotNull {
            if (it.problem?.contestId == null || it.problem.index == null || it.verdict == null) null
            else {
                CfSubmission(
                    user = user,
                    problemId = ProblemId(it.problem.contestId, it.problem.index),
                    verdict = it.verdict
                )
            }
        }

        repository.saveAll(cfSubmissions)
    }
}