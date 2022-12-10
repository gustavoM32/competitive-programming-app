# syntax=docker/dockerfile:1
# build server
FROM openjdk:17-jdk-alpine3.14 AS BUILD

WORKDIR /build

COPY gradlew .
COPY gradle/ ./gradle

RUN ./gradlew

COPY build.gradle.kts .
COPY settings.gradle.kts .

COPY src/ ./src

RUN ./gradlew build

# run server
FROM openjdk:17-jdk-alpine3.14

WORKDIR /app

COPY --from=BUILD /build/build/libs/competitive-programming-app-0.0.1.jar .

ENTRYPOINT ["java", "-jar", "competitive-programming-app-0.0.1.jar"]
