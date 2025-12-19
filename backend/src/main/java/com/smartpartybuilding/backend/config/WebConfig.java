package com.smartpartybuilding.backend.config;

import com.smartpartybuilding.backend.service.AuthService;
import java.nio.file.Path;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
  private final AppProperties appProperties;
  private final AuthService authService;

  public WebConfig(AppProperties appProperties, AuthService authService) {
    this.appProperties = appProperties;
    this.authService = authService;
  }

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
        .allowedOriginPatterns(appProperties.cors().allowedOrigins())
        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
        .allowedHeaders("*")
        .allowCredentials(false);
  }

  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(new AuthInterceptor(authService));
  }

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    String uploadDir = Path.of(appProperties.storage().uploadDir()).toAbsolutePath().normalize().toString();
    registry.addResourceHandler("/files/**")
        .addResourceLocations("file:" + uploadDir + "/");
  }

  @Bean
  public FilterRegistrationBean<RequestDecryptionFilter> requestDecryptionFilterRegistration() {
    FilterRegistrationBean<RequestDecryptionFilter> registration = new FilterRegistrationBean<>();
    registration.setFilter(new RequestDecryptionFilter());
    registration.addUrlPatterns("/*");
    registration.setOrder(1);
    return registration;
  }
}
