package com.gustavo.competitiveprogrammingapp.config

import com.gustavo.competitiveprogrammingapp.rest.problem.ProblemEventHandler
import com.gustavo.competitiveprogrammingapp.rest.problem.ProblemRepository
import com.gustavo.competitiveprogrammingapp.rest.problemList.ProblemListEventHandler
import com.gustavo.competitiveprogrammingapp.rest.problemList.ProblemListRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class RepositoryConfiguration {

    @Bean
    @Autowired
    fun problemEventHandler(problemRepository: ProblemRepository): ProblemEventHandler {
        return ProblemEventHandler(problemRepository)
    }

    @Bean
    @Autowired
    fun problemListEventHandler(problemListRepository: ProblemListRepository): ProblemListEventHandler {
        return ProblemListEventHandler(problemListRepository)
    }
}