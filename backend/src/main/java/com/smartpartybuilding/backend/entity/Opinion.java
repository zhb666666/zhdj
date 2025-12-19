package com.smartpartybuilding.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "opinions", indexes = {
    @Index(name = "idx_opinion_org", columnList = "organizationId"),
    @Index(name = "idx_opinion_submit_time", columnList = "submitTime")
})
public class Opinion extends BaseEntity {
  @Column(nullable = false, length = 100)
  private String subject;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String content;

  private Long organizationId;

  private Long submitterId;

  @Column(nullable = false, length = 50)
  private String submitterName;

  @Column(nullable = false, length = 20)
  private String phone;

  @Column(nullable = false)
  private LocalDateTime submitTime;

  public String getSubject() {
    return subject;
  }

  public void setSubject(String subject) {
    this.subject = subject;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public Long getOrganizationId() {
    return organizationId;
  }

  public void setOrganizationId(Long organizationId) {
    this.organizationId = organizationId;
  }

  public Long getSubmitterId() {
    return submitterId;
  }

  public void setSubmitterId(Long submitterId) {
    this.submitterId = submitterId;
  }

  public String getSubmitterName() {
    return submitterName;
  }

  public void setSubmitterName(String submitterName) {
    this.submitterName = submitterName;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public LocalDateTime getSubmitTime() {
    return submitTime;
  }

  public void setSubmitTime(LocalDateTime submitTime) {
    this.submitTime = submitTime;
  }
}
