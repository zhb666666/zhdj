package com.smartpartybuilding.backend.repository;

import com.smartpartybuilding.backend.entity.UserToken;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserTokenRepository extends JpaRepository<UserToken, Long> {
  Optional<UserToken> findByToken(String token);

  long deleteByExpiresAtBefore(LocalDateTime time);
}
