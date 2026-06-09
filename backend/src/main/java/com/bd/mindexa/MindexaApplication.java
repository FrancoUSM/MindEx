
package com.bd.mindexa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class MindexaApplication {

    public static void main(String[] args) {
        SpringApplication.run(MindexaApplication.class, args);
    }

    @GetMapping("/")
    public String home() {
        return "Mindex backend funcionando en Azure";
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}