package com.smartpartybuilding.backend.dto;

import com.smartpartybuilding.backend.entity.PersonnelType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PersonnelUpsertRequest(
    @NotNull PersonnelType type,
    @NotBlank String name,
    String position,
    String phone,
    String grid
) {}
