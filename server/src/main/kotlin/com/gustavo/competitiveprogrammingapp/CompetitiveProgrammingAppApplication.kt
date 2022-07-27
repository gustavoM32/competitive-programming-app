package com.gustavo.competitiveprogrammingapp

import com.gustavo.competitiveprogrammingapp.domain.problemList.ProblemList
import com.gustavo.competitiveprogrammingapp.problem.ProblemListRepository
import com.gustavo.competitiveprogrammingapp.user.User
import com.gustavo.competitiveprogrammingapp.user.UserRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import java.time.LocalDateTime

@SpringBootApplication
class CompetitiveProgrammingAppApplication(
	private val urepository: UserRepository,
	private val problemListRepository: ProblemListRepository
	): CommandLineRunner {

	private val logger: Logger = LoggerFactory.getLogger(javaClass)

	override fun run(args: Array<String>) {
		logger.info("MEU LINDO DEBUG")

		problemListRepository.save(
			ProblemList(
				link = "www.google.com",
				name = "olar",
				description = "",
				notes = "",
				dateAdded = LocalDateTime.parse("2022-04-10T00:00:00"),
				solvedCount = 0,
				totalCount = 0
			)
		)


		urepository.save(
			User(
				"yuke",
				"user",
				"\$2a\$04\$1.YhMIgNX/8TkCKGFUONWO1waedKhQ5KrnB30fl0Q01QKqmzLf.Zi",
				"USER"
			)
		)
//		urepository.save(
//			User(
//				"aff",
//				"admin",
//				"\$2a\$04\$KNLUwOWHVQZVpXyMBNc7JOzbLiBjb9Tk9bP7KNcPI12ICuvzXQQKG",
//				"ADMIN"
//			)
//		)
	}
}

fun main(args: Array<String>) {
	runApplication<CompetitiveProgrammingAppApplication>(*args)
}
