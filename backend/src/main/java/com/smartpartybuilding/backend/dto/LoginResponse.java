package com.smartpartybuilding.backend.dto;

public record LoginResponse(String token, String refreshToken, UserInfoDto userInfo, Long expiresIn) {}
