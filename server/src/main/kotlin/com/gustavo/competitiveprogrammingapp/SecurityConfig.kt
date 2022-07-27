package com.gustavo.competitiveprogrammingapp

import com.gustavo.competitiveprogrammingapp.auth.AuthenticationFilter
import com.gustavo.competitiveprogrammingapp.auth.LoginFilter
import com.gustavo.competitiveprogrammingapp.auth.UserDetailServiceImpl
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

//import org.springframework.security.provisioning.InMemoryUserDetailsManager
//
@Configuration
@EnableWebSecurity
class SecurityConfig(
    private val userDetailsService: UserDetailServiceImpl
) : WebSecurityConfigurerAdapter() {

    @Throws(Exception::class)
    override fun configure(http: HttpSecurity) {
        http.csrf().disable().cors().and().authorizeRequests().anyRequest().permitAll()
//        http.csrf().disable().cors().and().authorizeRequests()
//            .antMatchers(HttpMethod.POST, "/login").permitAll()
//            .anyRequest().authenticated()
//            .and()
//            .addFilterBefore(
//                LoginFilter("/login", authenticationManager()),
//                UsernamePasswordAuthenticationFilter::class.java)
//            .addFilterBefore(
//                AuthenticationFilter(),
//                UsernamePasswordAuthenticationFilter::class.java)
    }


    @Autowired
    @Throws(Exception::class)
    fun configureGlobal(auth: AuthenticationManagerBuilder) {
        auth.userDetailsService(userDetailsService)
            .passwordEncoder(BCryptPasswordEncoder())
    }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val source = UrlBasedCorsConfigurationSource()
        val config = CorsConfiguration()
        config.allowedOriginPatterns = listOf("*")
        config.allowedMethods = listOf("*")
        config.allowedHeaders = listOf("*")
        config.allowCredentials = true
        config.applyPermitDefaultValues()
        source.registerCorsConfiguration("/**", config)
        return source
    }

}
