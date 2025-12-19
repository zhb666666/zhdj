package com.smartpartybuilding.backend.dto;

public record PartyMemberDto(
    Long id,
    String name,
    String gender,
    String ethnic,
    String idCard,
    String phone,
    Long organizationId,
    String organizationName,
    String position,
    String guideEnterprise,
    String memberType
) {}
