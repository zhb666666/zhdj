package com.smartpartybuilding.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

public record OpinionUpsertRequest(
    @NotBlank String subject,
    @NotBlank String content,
    @NotBlank String phone,
    Long organizationId,
    @NotNull LocalDateTime submitTime,
    Long submitterId,
    @NotBlank String submitterName,
    List<Long> attachmentIds
) {}
