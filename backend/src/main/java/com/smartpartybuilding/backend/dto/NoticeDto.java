package com.smartpartybuilding.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public record NoticeDto(
    Long id,
    String name,
    LocalDateTime publishTime,
    String content,
    List<AttachmentDto> attachments
) {}
