package com.smartpartybuilding.backend.util;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

public final class XorBase64Crypto {
  private XorBase64Crypto() {}

  public static String decryptToString(String base64, String key) {
    if (base64 == null || base64.isBlank()) {
      return "";
    }
    if (key == null || key.isEmpty()) {
      throw new IllegalArgumentException("Missing encryption key");
    }

    byte[] encryptedBytes;
    try {
      encryptedBytes = Base64.getDecoder().decode(base64);
    } catch (IllegalArgumentException e) {
      throw new IllegalArgumentException("Invalid base64 payload", e);
    }

    byte[] keyBytes = key.getBytes(StandardCharsets.UTF_8);
    byte[] plain = new byte[encryptedBytes.length];
    for (int i = 0; i < encryptedBytes.length; i++) {
      plain[i] = (byte) (encryptedBytes[i] ^ keyBytes[i % keyBytes.length]);
    }

    return new String(plain, StandardCharsets.UTF_8);
  }

  public static String encryptFromString(String plainText, String key) {
    if (plainText == null) {
      plainText = "";
    }
    if (key == null || key.isEmpty()) {
      throw new IllegalArgumentException("Missing encryption key");
    }

    byte[] plainBytes = plainText.getBytes(StandardCharsets.UTF_8);
    byte[] keyBytes = key.getBytes(StandardCharsets.UTF_8);
    byte[] encrypted = new byte[plainBytes.length];

    for (int i = 0; i < plainBytes.length; i++) {
      encrypted[i] = (byte) (plainBytes[i] ^ keyBytes[i % keyBytes.length]);
    }

    return Base64.getEncoder().encodeToString(encrypted);
  }
}
