package com.smartpartybuilding.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_tokens", indexes = {
    @Index(name = "idx_user_tokens_token", columnList = "token", unique = true),
    @Index(name = "idx_user_tokens_user", columnList = "user_id")
})
public class UserToken extends BaseEntity {
  @Column(nullable = false, length = 255)
  private String token;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(name = "expire_time", nullable = false)
  private LocalDateTime expiresAt;

  public String getToken() {
    return token;
  }

  public void setToken(String token) {
    this.token = token;
  }

  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public LocalDateTime getExpiresAt() {
    return expiresAt;
  }

  public void setExpiresAt(LocalDateTime expiresAt) {
    this.expiresAt = expiresAt;
  }
}
