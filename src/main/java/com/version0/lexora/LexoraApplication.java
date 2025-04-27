package com.version0.lexora;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan("com.version0.lexora")
public class LexoraApplication {

	public static void main(String[] args) {
		SpringApplication.run(LexoraApplication.class, args);
	}

}
