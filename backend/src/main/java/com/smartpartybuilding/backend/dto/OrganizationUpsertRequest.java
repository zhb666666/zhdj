package com.smartpartybuilding.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record OrganizationUpsertRequest(
    @NotBlank String name,
    @NotBlank String code,
    @NotBlank String category,
    Long parentId
) {}
