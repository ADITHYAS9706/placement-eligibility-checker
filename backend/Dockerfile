FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

EXPOSE 10000

CMD ["sh", "-c", "if [ -n \"$DATABASE_URL\" ]; then database_address=${DATABASE_URL#postgresql://}; database_address=${database_address#*@}; export SPRING_DATASOURCE_URL=\"jdbc:postgresql://$database_address\"; fi; exec java -jar target/*.jar"]