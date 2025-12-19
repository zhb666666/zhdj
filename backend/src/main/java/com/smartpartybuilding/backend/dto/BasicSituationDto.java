package com.smartpartybuilding.backend.dto;

public record BasicSituationDto(
    Long id,
    int keyEnterpriseCount,
    int managedPartyOrgCount,
    int managedMemberCount,
    int highEndChemGridCount
) {}
