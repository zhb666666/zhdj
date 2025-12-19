package com.smartpartybuilding.backend.dto;

import java.util.List;

public record OrganizationTreeNodeDto(Long id, String name, String code, String category, List<OrganizationTreeNodeDto> children) {}
