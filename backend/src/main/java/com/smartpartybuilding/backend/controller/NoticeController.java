package com.smartpartybuilding.backend.controller;

import com.smartpartybuilding.backend.dto.NoticeDto;
import com.smartpartybuilding.backend.dto.NoticeUpsertRequest;
import com.smartpartybuilding.backend.dto.PageResponse;
import com.smartpartybuilding.backend.service.NoticeService;
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
@RequestMapping("/notices")
public class NoticeController {
  private final NoticeService noticeService;

  public NoticeController(NoticeService noticeService) {
    this.noticeService = noticeService;
  }

  @GetMapping
  public PageResponse<NoticeDto> list(
      @RequestParam(required = false) String name,
      @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE_TIME) LocalDateTime startTime,
      @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE_TIME) LocalDateTime endTime,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    return noticeService.list(name, startTime, endTime, page, size);
  }

  @GetMapping("/{id}")
  public NoticeDto detail(@PathVariable Long id) {
    NoticeDto dto = noticeService.get(id);
    if (dto == null) {
      throw new NotFoundException("Notice not found");
    }
    return dto;
  }

  @PostMapping
  public NoticeDto create(@Valid @RequestBody NoticeUpsertRequest request) {
    return noticeService.create(request);
  }

  @PutMapping("/{id}")
  public NoticeDto update(@PathVariable Long id, @Valid @RequestBody NoticeUpsertRequest request) {
    NoticeDto dto = noticeService.update(id, request);
    if (dto == null) {
      throw new NotFoundException("Notice not found");
    }
    return dto;
  }

  @DeleteMapping("/{id}")
  public java.util.Map<String, Object> delete(@PathVariable Long id) {
    boolean ok = noticeService.delete(id);
    if (!ok) {
      throw new NotFoundException("Notice not found");
    }
    return java.util.Map.of("success", true);
  }

  private static class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
      super(message);
    }
  }
}
