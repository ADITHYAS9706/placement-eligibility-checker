package placement_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "placement_api")
public class PlacementApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(PlacementApiApplication.class, args);
    }
}