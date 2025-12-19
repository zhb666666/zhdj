package com.smartpartybuilding.backend.controller;

import com.smartpartybuilding.backend.dto.OpinionDto;
import com.smartpartybuilding.backend.dto.OpinionUpsertRequest;
import com.smartpartybuilding.backend.dto.PageResponse;
import com.smartpartybuilding.backend.service.OpinionService;
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
@RequestMapping("/opinions")
public class OpinionController {
  private final OpinionService opinionService;

  public OpinionController(OpinionService opinionService) {
    this.opinionService = opinionService;
  }

  @GetMapping
  public PageResponse<OpinionDto> list(
      @RequestParam(required = false) String subject,
      @RequestParam(required = false) Long organizationId,
      @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE_TIME) LocalDateTime startTime,
      @RequestParam(required = false) @DateTimeFormat(iso = ISO.DATE_TIME) LocalDateTime endTime,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    return opinionService.list(subject, organizationId, startTime, endTime, page, size);
  }

  @GetMapping("/{id}")
  public OpinionDto detail(@PathVariable Long id) {
    OpinionDto dto = opinionService.get(id);
    if (dto == null) {
      throw new NotFoundException("Opinion not found");
    }
    return dto;
  }

  @PostMapping
  public OpinionDto create(@Valid @RequestBody OpinionUpsertRequest request) {
    return opinionService.create(request);
  }

  @PutMapping("/{id}")
  public OpinionDto update(@PathVariable Long id, @Valid @RequestBody OpinionUpsertRequest request) {
    OpinionDto dto = opinionService.update(id, request);
    if (dto == null) {
      throw new NotFoundException("Opinion not found");
    }
    return dto;
  }

  @DeleteMapping("/{id}")
  public java.util.Map<String, Object> delete(@PathVariable Long id) {
    boolean ok = opinionService.delete(id);
    if (!ok) {
      throw new NotFoundException("Opinion not found");
    }
    return java.util.Map.of("success", true);
  }

  private static class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
      super(message);
    }
  }
}
