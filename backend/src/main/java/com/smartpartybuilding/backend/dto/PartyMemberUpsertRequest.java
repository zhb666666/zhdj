package com.smartpartybuilding.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record PartyMemberUpsertRequest(
    @NotBlank String name,
    String gender,
    String ethnic,
    @NotBlank String idCard,
    String phone,
    Long organizationId,
    String position,
    String guideEnterprise,
    String memberType
) {}
