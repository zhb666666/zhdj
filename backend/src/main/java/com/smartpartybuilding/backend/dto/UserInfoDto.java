package com.smartpartybuilding.backend.dto;

import com.smartpartybuilding.backend.entity.UserRole;

public record UserInfoDto(Long id, String name, UserRole role, Long organizationId) {}
