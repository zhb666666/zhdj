package com.smartpartybuilding.backend.config;

import com.smartpartybuilding.backend.entity.User;
import com.smartpartybuilding.backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.HandlerInterceptor;

public class AuthInterceptor implements HandlerInterceptor {
  public static final String ATTR_USER = "AUTH_USER";

  private final AuthService authService;

  public AuthInterceptor(AuthService authService) {
    this.authService = authService;
  }

  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
    String path = request.getRequestURI();
    if (path.equals("/auth/login") || path.equals("/auth/wx-login")) {
      return true;
    }
    if (path.startsWith("/public") || path.startsWith("/files")) {
      return true;
    }

    String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      response.setContentType(MediaType.APPLICATION_JSON_VALUE);
      response.getWriter().write("{\"message\":\"Unauthorized\"}");
      return false;
    }

    String token = authHeader.substring("Bearer ".length()).trim();
    User user = authService.getUserByToken(token);
    if (user == null) {
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      response.setContentType(MediaType.APPLICATION_JSON_VALUE);
      response.getWriter().write("{\"message\":\"Invalid token\"}");
      return false;
    }

    request.setAttribute(ATTR_USER, user);
    return true;
  }
}
