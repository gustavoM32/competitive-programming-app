package com.gustavo.competitiveprogrammingapp.config

import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider
import org.springframework.context.annotation.Configuration
import org.springframework.core.type.filter.RegexPatternTypeFilter
import org.springframework.data.rest.core.config.RepositoryRestConfiguration
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer
import org.springframework.web.servlet.config.annotation.CorsRegistry
import java.util.regex.Pattern

@Configuration
class RestConfiguration : RepositoryRestConfigurer {
    override fun configureRepositoryRestConfiguration(config: RepositoryRestConfiguration, cors: CorsRegistry) {
        val provider = ClassPathScanningCandidateComponentProvider(false)
        provider.addIncludeFilter(RegexPatternTypeFilter(Pattern.compile(".*")))

        val beans = provider.findCandidateComponents("com.gustavo.competitiveprogrammingapp")

        for (bean in beans) {
            var idExposedClasses: Class<*>?
            try {
                idExposedClasses = Class.forName(bean.beanClassName)
                config.exposeIdsFor(Class.forName(idExposedClasses.name))
            } catch (e: ClassNotFoundException) {
                // Can't throw ClassNotFoundException due to the method signature. Need to cast it
                throw RuntimeException("Failed to expose `id` field due to", e)
            }
        }

        config.maxPageSize = 20000
        config.defaultPageSize = Int.MAX_VALUE
    }
}
