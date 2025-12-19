package com.smartpartybuilding.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(Auth auth, Storage storage, Cors cors) {
  public record Auth(long tokenTtlSeconds) {}

  public record Storage(String uploadDir) {}

  public record Cors(String allowedOrigins) {}
}
