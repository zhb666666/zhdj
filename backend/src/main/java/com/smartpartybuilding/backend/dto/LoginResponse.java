package com.smartpartybuilding.backend.dto;

public record LoginResponse(String token, UserInfoDto userInfo) {}
