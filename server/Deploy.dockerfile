# syntax=docker/dockerfile:1
FROM openjdk:17-jdk-alpine3.14 AS BUILD

WORKDIR /build

COPY src/ ./src
COPY gradle/ ./gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .
COPY gradlew .

RUN ./gradlew build

FROM openjdk:17-jdk-alpine3.14

WORKDIR /app

COPY --from=BUILD /build/build/libs/competitive-programming-app-0.0.1.jar .

ENTRYPOINT ["java", "-jar", "competitive-programming-app-0.0.1.jar"]
