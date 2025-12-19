package com.smartpartybuilding.backend.dto;

public record BasicSituationUpdateRequest(
    int keyEnterpriseCount,
    int managedPartyOrgCount,
    int managedMemberCount,
    int highEndChemGridCount
) {}
