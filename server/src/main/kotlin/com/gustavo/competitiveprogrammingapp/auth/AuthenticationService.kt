package com.gustavo.competitiveprogrammingapp.auth

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import java.util.*
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class AuthenticationService {
    companion object {
        private const val EXPIRATION_TIME = 86_400_000
        private const val SIGNINKEY = "SecretKey" // use base64-encoded string
        private const val PREFIX = "Bearer"

        fun addToken(res: HttpServletResponse, username: String) {
            val jwtToken = Jwts.builder().setSubject(username)
                .setExpiration(Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS512, SIGNINKEY)
                .compact()
            res.addHeader("Authorization", "$PREFIX $jwtToken")
            res.addHeader("Access-Control-Expose-Headers", "Authorization")
        }

        fun getAuthentication(request: HttpServletRequest): Authentication? {
            val token = request.getHeader("Authorization")
            if (token != null) {
                val user = Jwts.parser()
                    .setSigningKey(SIGNINKEY)
                    .parseClaimsJws(token.replace(PREFIX, ""))
                    .body
                    .subject

                if (user != null)
                    return UsernamePasswordAuthenticationToken(user, null, emptyList())
            }

            return null
        }

    }

}