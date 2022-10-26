package com.gustavo.competitiveprogrammingapp.information.processors

import com.gustavo.competitiveprogrammingapp.cfApi.CfApiResourceFetcher
import com.gustavo.competitiveprogrammingapp.information.ProblemId
import com.gustavo.competitiveprogrammingapp.information.domain.CfSubmission
import com.gustavo.competitiveprogrammingapp.information.repositories.CfSubmissionRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component

@Component
class CfSubmissionsProcessor(
    private val repository: CfSubmissionRepository,
    private val cfApiResourceFetcher: CfApiResourceFetcher
) {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    fun update(user: String) {
        logger.info("CfSubmissionsProcessor update start...")
        val userStatus = cfApiResourceFetcher.getUserStatus(user)

        val cfSubmissions = userStatus.mapNotNull {
            if (it.id == null || it.problem?.contestId == null || it.problem.index == null || it.verdict == null) null
            else {
                CfSubmission(
                    id = it.id,
                    user = user,
                    problemId = ProblemId(it.problem.contestId, it.problem.index),
                    verdict = it.verdict
                )
            }
        }

        repository.saveAll(cfSubmissions)
        logger.info("CfSubmissionsProcessor update completed.")
    }

    fun updateAndFindAll(user: String): List<CfSubmission> {
        update(user)
        return repository.findAll()
    }

    fun reset(user: String) {
        repository.deleteAll()
        update(user)
    }
}