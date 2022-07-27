package com.gustavo.competitiveprogrammingapp.auth

import com.gustavo.competitiveprogrammingapp.user.User
import com.gustavo.competitiveprogrammingapp.user.UserRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.security.core.authority.AuthorityUtils
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class UserDetailServiceImpl(
    private val repository: UserRepository
    ) : UserDetailsService {
    private val logger: Logger = LoggerFactory.getLogger(javaClass)

    @Throws(UsernameNotFoundException::class)
    override fun loadUserByUsername(username: String): UserDetails {
        val currentUser: User = repository.findByUsername(username)
        logger.info(username)
        logger.info("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
        logger.info(currentUser.password)

        return org.springframework.security.core.userdetails.User(
            username, currentUser.password,
            true, true, true, true,
            AuthorityUtils.createAuthorityList(currentUser.role)
        )
    }
}