package com.smartpartybuilding.backend.controller;

import com.smartpartybuilding.backend.dto.NewsDto;
import com.smartpartybuilding.backend.dto.NewsUpsertRequest;
import com.smartpartybuilding.backend.dto.PageResponse;
import com.smartpartybuilding.backend.service.NewsService;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/news")
public class NewsController {
  private final NewsService newsService;

  public NewsController(NewsService newsService) {
    this.newsService = newsService;
  }

  @GetMapping
  public PageResponse<NewsDto> list(
      @RequestParam(required = false) String title,
      @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE_TIME) LocalDateTime startTime,
      @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE_TIME) LocalDateTime endTime,
      @RequestParam(required = false) Boolean carousel,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    return newsService.list(title, startTime, endTime, carousel, page, size);
  }

  @GetMapping("/{id}")
  public NewsDto detail(@PathVariable Long id) {
    NewsDto dto = newsService.get(id);
    if (dto == null) {
      throw new NotFoundException("News not found");
    }
    return dto;
  }

  @PostMapping
  public NewsDto create(@Valid @RequestBody NewsUpsertRequest request) {
    return newsService.create(request);
  }

  @PutMapping("/{id}")
  public NewsDto update(@PathVariable Long id, @Valid @RequestBody NewsUpsertRequest request) {
    NewsDto dto = newsService.update(id, request);
    if (dto == null) {
      throw new NotFoundException("News not found");
    }
    return dto;
  }

  @DeleteMapping("/{id}")
  public java.util.Map<String, Object> delete(@PathVariable Long id) {
    boolean ok = newsService.delete(id);
    if (!ok) {
      throw new NotFoundException("News not found");
    }
    return java.util.Map.of("success", true);
  }

  private static class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
      super(message);
    }
  }
}
