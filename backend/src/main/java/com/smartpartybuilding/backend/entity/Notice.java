package com.smartpartybuilding.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "notices", indexes = {
    @Index(name = "idx_notice_publish_time", columnList = "publishTime")
})
public class Notice extends BaseEntity {
  @Column(nullable = false, length = 100)
  private String name;

  @Column(nullable = false)
  private LocalDateTime publishTime;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String content;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public LocalDateTime getPublishTime() {
    return publishTime;
  }

  public void setPublishTime(LocalDateTime publishTime) {
    this.publishTime = publishTime;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }
}
