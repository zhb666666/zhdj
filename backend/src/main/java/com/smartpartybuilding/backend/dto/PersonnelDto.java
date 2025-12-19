package com.smartpartybuilding.backend.dto;

import com.smartpartybuilding.backend.entity.PersonnelType;

public record PersonnelDto(Long id, PersonnelType type, String name, String position, String phone, String grid) {}
