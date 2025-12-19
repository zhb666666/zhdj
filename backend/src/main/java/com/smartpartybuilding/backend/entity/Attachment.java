package com.smartpartybuilding.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

@Entity
@Table(name = "attachments", indexes = {
    @Index(name = "idx_attachment_business", columnList = "businessType,businessId")
})
public class Attachment extends BaseEntity {
  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private AttachmentBusinessType businessType;

  private Long businessId;

  @Column(nullable = false, length = 255)
  private String originalName;

  @Column(nullable = false, length = 255)
  private String storedName;

  @Column(nullable = false, length = 500)
  private String url;

  @Column(nullable = false)
  private long size;

  @Column(length = 100)
  private String contentType;

  public AttachmentBusinessType getBusinessType() {
    return businessType;
  }

  public void setBusinessType(AttachmentBusinessType businessType) {
    this.businessType = businessType;
  }

  public Long getBusinessId() {
    return businessId;
  }

  public void setBusinessId(Long businessId) {
    this.businessId = businessId;
  }

  public String getOriginalName() {
    return originalName;
  }

  public void setOriginalName(String originalName) {
    this.originalName = originalName;
  }

  public String getStoredName() {
    return storedName;
  }

  public void setStoredName(String storedName) {
    this.storedName = storedName;
  }

  public String getUrl() {
    return url;
  }

  public void setUrl(String url) {
    this.url = url;
  }

  public long getSize() {
    return size;
  }

  public void setSize(long size) {
    this.size = size;
  }

  public String getContentType() {
    return contentType;
  }

  public void setContentType(String contentType) {
    this.contentType = contentType;
  }
}
