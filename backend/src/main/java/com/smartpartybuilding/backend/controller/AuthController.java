package com.smartpartybuilding.backend.controller;

import com.smartpartybuilding.backend.config.AuthInterceptor;
import com.smartpartybuilding.backend.dto.LoginRequest;
import com.smartpartybuilding.backend.dto.LoginResponse;
import com.smartpartybuilding.backend.dto.UserInfoDto;
import com.smartpartybuilding.backend.entity.User;
import com.smartpartybuilding.backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/login")
  public LoginResponse login(@Valid @RequestBody LoginRequest request) {
    LoginResponse response = authService.login(request.username(), request.password());
    if (response == null) {
      throw new UnauthorizedException("用户名或密码错误");
    }
    return response;
  }

  @PostMapping("/logout")
  public Map<String, Object> logout() {
    return Map.of("success", true);
  }

  @PostMapping("/refresh-token")
  public Map<String, Object> refreshToken(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorization) {
    String token = authorization.replaceFirst("^Bearer\\s+", "").trim();
    String newToken = authService.refreshToken(token);
    if (newToken == null) {
      throw new UnauthorizedException("Invalid token");
    }
    return Map.of("token", newToken);
  }

  @GetMapping("/user-info")
  public UserInfoDto userInfo(HttpServletRequest request) {
    User user = (User) request.getAttribute(AuthInterceptor.ATTR_USER);
    if (user == null) {
      throw new UnauthorizedException("Unauthorized");
    }
    return new UserInfoDto(user.getId(), user.getName(), user.getRole(), user.getOrganizationId());
  }

  @PostMapping("/wx-login")
  @ResponseStatus(HttpStatus.NOT_IMPLEMENTED)
  public Map<String, Object> wxLogin() {
    return Map.of("message", "Not implemented");
  }

  @ResponseStatus(HttpStatus.UNAUTHORIZED)
  private static class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
      super(message);
    }
  }
}
