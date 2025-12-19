package com.smartpartybuilding.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

public record NoticeUpsertRequest(
    @NotBlank String name,
    @NotNull LocalDateTime publishTime,
    @NotBlank String content,
    List<Long> attachmentIds
) {}
