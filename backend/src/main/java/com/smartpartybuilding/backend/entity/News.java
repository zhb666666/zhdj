package com.smartpartybuilding.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "news", indexes = {
    @Index(name = "idx_news_publish_time", columnList = "publishTime"),
    @Index(name = "idx_news_carousel", columnList = "carousel")
})
public class News extends BaseEntity {
  @Column(nullable = false, length = 100)
  private String title;

  @Column(nullable = false)
  private LocalDateTime publishTime;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String content;

  private String iconUrl;

  @Column(nullable = false)
  private boolean carousel;

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
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

  public String getIconUrl() {
    return iconUrl;
  }

  public void setIconUrl(String iconUrl) {
    this.iconUrl = iconUrl;
  }

  public boolean isCarousel() {
    return carousel;
  }

  public void setCarousel(boolean carousel) {
    this.carousel = carousel;
  }
}
