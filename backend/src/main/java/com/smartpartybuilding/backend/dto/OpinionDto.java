package com.smartpartybuilding.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public record OpinionDto(
    Long id,
    String subject,
    String content,
    Long organizationId,
    String organizationName,
    LocalDateTime submitTime,
    Long submitterId,
    String submitterName,
    String phone,
    List<AttachmentDto> attachments
) {}
