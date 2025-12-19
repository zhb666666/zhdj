package com.smartpartybuilding.backend.dto;

import com.smartpartybuilding.backend.entity.Attachment;

public record AttachmentDto(Long id, String originalName, String url, long size, String contentType) {
  public static AttachmentDto fromEntity(Attachment a) {
    return new AttachmentDto(a.getId(), a.getOriginalName(), a.getUrl(), a.getSize(), a.getContentType());
  }
}
