package com.smartpartybuilding.backend.service;

import com.smartpartybuilding.backend.dto.NewsDto;
import com.smartpartybuilding.backend.dto.NewsUpsertRequest;
import com.smartpartybuilding.backend.dto.PageResponse;
import com.smartpartybuilding.backend.entity.News;
import com.smartpartybuilding.backend.repository.NewsRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NewsService {
  private final NewsRepository newsRepository;

  public NewsService(NewsRepository newsRepository) {
    this.newsRepository = newsRepository;
  }

  @Transactional(readOnly = true)
  public PageResponse<NewsDto> list(String title, LocalDateTime startTime, LocalDateTime endTime, Boolean carousel, int page, int size) {
    Specification<News> spec = Specification.where(null);
    if (title != null && !title.isBlank()) {
      spec = spec.and((root, query, cb) -> cb.like(root.get("title"), "%" + title.trim() + "%"));
    }
    if (startTime != null) {
      spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("publishTime"), startTime));
    }
    if (endTime != null) {
      spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("publishTime"), endTime));
    }
    if (carousel != null) {
      spec = spec.and((root, query, cb) -> cb.equal(root.get("carousel"), carousel));
    }

    Page<News> result = newsRepository.findAll(spec, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishTime")));
    List<NewsDto> items = result.getContent().stream().map(this::toDto).toList();

    return new PageResponse<>(items, result.getTotalElements(), page, size);
  }

  @Transactional(readOnly = true)
  public NewsDto get(Long id) {
    News news = newsRepository.findById(id).orElse(null);
    return news == null ? null : toDto(news);
  }

  @Transactional
  public NewsDto create(NewsUpsertRequest req) {
    News news = new News();
    apply(news, req);
    return toDto(newsRepository.save(news));
  }

  @Transactional
  public NewsDto update(Long id, NewsUpsertRequest req) {
    News news = newsRepository.findById(id).orElse(null);
    if (news == null) {
      return null;
    }
    apply(news, req);
    return toDto(newsRepository.save(news));
  }

  @Transactional
  public boolean delete(Long id) {
    if (!newsRepository.existsById(id)) {
      return false;
    }
    newsRepository.deleteById(id);
    return true;
  }

  private void apply(News news, NewsUpsertRequest req) {
    news.setTitle(req.title());
    news.setPublishTime(req.publishTime());
    news.setContent(req.content());
    news.setIconUrl(req.iconUrl());
    news.setCarousel(req.carousel());
  }

  private NewsDto toDto(News news) {
    return new NewsDto(news.getId(), news.getTitle(), news.getPublishTime(), news.getContent(), news.getIconUrl(), news.isCarousel());
  }
}
