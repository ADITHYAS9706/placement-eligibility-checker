FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

EXPOSE 10000

CMD ["sh", "-c", "if [ -n \"$DATABASE_URL\" ]; then export SPRING_DATASOURCE_URL=\"jdbc:$DATABASE_URL\"; fi; java -jar target/*.jar"]