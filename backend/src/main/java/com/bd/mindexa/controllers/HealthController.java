package com.bd.mindexa.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public String home() {
        return "Mindex backend funcionando en Azure";
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}
