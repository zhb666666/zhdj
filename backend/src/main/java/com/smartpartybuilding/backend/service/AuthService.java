package com.smartpartybuilding.backend.service;

import com.smartpartybuilding.backend.config.AppProperties;
import com.smartpartybuilding.backend.dto.LoginResponse;
import com.smartpartybuilding.backend.dto.UserInfoDto;
import com.smartpartybuilding.backend.entity.User;
import com.smartpartybuilding.backend.entity.UserToken;
import com.smartpartybuilding.backend.repository.UserRepository;
import com.smartpartybuilding.backend.repository.UserTokenRepository;
import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
  private final AppProperties appProperties;
  private final UserRepository userRepository;
  private final UserTokenRepository userTokenRepository;

  public AuthService(AppProperties appProperties, UserRepository userRepository, UserTokenRepository userTokenRepository) {
    this.appProperties = appProperties;
    this.userRepository = userRepository;
    this.userTokenRepository = userTokenRepository;
  }

  @Transactional
  public LoginResponse login(String username, String passwordHash) {
    User user = userRepository.findByUsername(username).orElse(null);
    if (user == null || !user.getPasswordHash().equals(passwordHash)) {
      return null;
    }

    userTokenRepository.deleteByExpiresAtBefore(LocalDateTime.now());

    String token = UUID.randomUUID().toString().replace("-", "");
    String refreshToken = UUID.randomUUID().toString().replace("-", "");
    Long expiresIn = appProperties.auth().tokenTtlSeconds();
    
    UserToken userToken = new UserToken();
    userToken.setToken(token);
    userToken.setUserId(user.getId());
    userToken.setExpiresAt(LocalDateTime.now().plusSeconds(expiresIn));
    userTokenRepository.save(userToken);

    return new LoginResponse(token, refreshToken, new UserInfoDto(user.getId(), user.getName(), user.getRole(), user.getOrganizationId()), expiresIn);
  }

  @Transactional(readOnly = true)
  public User getUserByToken(String token) {
    if (token == null || token.isBlank()) {
      return null;
    }

    UserToken userToken = userTokenRepository.findByToken(token).orElse(null);
    if (userToken == null || userToken.getExpiresAt().isBefore(LocalDateTime.now())) {
      return null;
    }

    return userRepository.findById(userToken.getUserId()).orElse(null);
  }

  @Transactional
  public String refreshToken(String currentToken) {
    User user = getUserByToken(currentToken);
    if (user == null) {
      return null;
    }

    String newToken = UUID.randomUUID().toString().replace("-", "");
    UserToken userToken = new UserToken();
    userToken.setToken(newToken);
    userToken.setUserId(user.getId());
    userToken.setExpiresAt(LocalDateTime.now().plusSeconds(appProperties.auth().tokenTtlSeconds()));
    userTokenRepository.save(userToken);

    return newToken;
  }
}
