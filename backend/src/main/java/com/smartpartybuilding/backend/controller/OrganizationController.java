package com.smartpartybuilding.backend.controller;

import com.smartpartybuilding.backend.dto.OrganizationDto;
import com.smartpartybuilding.backend.dto.OrganizationTreeNodeDto;
import com.smartpartybuilding.backend.dto.OrganizationUpsertRequest;
import com.smartpartybuilding.backend.service.OrganizationService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/organizations")
public class OrganizationController {
  private final OrganizationService organizationService;

  public OrganizationController(OrganizationService organizationService) {
    this.organizationService = organizationService;
  }

  @GetMapping
  public List<OrganizationDto> list() {
    return organizationService.list();
  }

  @GetMapping("/tree")
  public List<OrganizationTreeNodeDto> tree() {
    return organizationService.tree();
  }

  @GetMapping("/{id}")
  public OrganizationDto detail(@PathVariable Long id) {
    OrganizationDto dto = organizationService.get(id);
    if (dto == null) {
      throw new NotFoundException("Organization not found");
    }
    return dto;
  }

  @PostMapping
  public OrganizationDto create(@Valid @RequestBody OrganizationUpsertRequest request) {
    return organizationService.create(request);
  }

  @PutMapping("/{id}")
  public OrganizationDto update(@PathVariable Long id, @Valid @RequestBody OrganizationUpsertRequest request) {
    OrganizationDto dto = organizationService.update(id, request);
    if (dto == null) {
      throw new NotFoundException("Organization not found");
    }
    return dto;
  }

  @DeleteMapping("/{id}")
  public java.util.Map<String, Object> delete(@PathVariable Long id) {
    boolean ok = organizationService.delete(id);
    if (!ok) {
      throw new NotFoundException("Organization not found");
    }
    return java.util.Map.of("success", true);
  }

  private static class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
      super(message);
    }
  }
}
