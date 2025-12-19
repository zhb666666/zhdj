package com.smartpartybuilding.backend.dto;

public record StatisticsOverviewDto(
    long opinionCount,
    long noticeCount,
    long newsCount,
    long organizationCount,
    long partyMemberCount,
    long advisorCount,
    long gridMemberCount
) {}
