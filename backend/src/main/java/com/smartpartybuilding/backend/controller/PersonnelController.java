package com.smartpartybuilding.backend.controller;

import com.smartpartybuilding.backend.dto.PageResponse;
import com.smartpartybuilding.backend.dto.PersonnelDto;
import com.smartpartybuilding.backend.dto.PersonnelUpsertRequest;
import com.smartpartybuilding.backend.entity.PersonnelType;
import com.smartpartybuilding.backend.service.PersonnelService;
import jakarta.validation.Valid;
import java.io.IOException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/personnel")
public class PersonnelController {
  private final PersonnelService personnelService;

  public PersonnelController(PersonnelService personnelService) {
    this.personnelService = personnelService;
  }

  @GetMapping
  public PageResponse<PersonnelDto> list(
      @RequestParam(required = false) PersonnelType type,
      @RequestParam(required = false) String name,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    return personnelService.list(type, name, page, size);
  }

  @GetMapping("/{id}")
  public PersonnelDto detail(@PathVariable Long id) {
    PersonnelDto dto = personnelService.get(id);
    if (dto == null) {
      throw new NotFoundException("Personnel not found");
    }
    return dto;
  }

  @PostMapping
  public PersonnelDto create(@Valid @RequestBody PersonnelUpsertRequest request) {
    return personnelService.create(request);
  }

  @PutMapping("/{id}")
  public PersonnelDto update(@PathVariable Long id, @Valid @RequestBody PersonnelUpsertRequest request) {
    PersonnelDto dto = personnelService.update(id, request);
    if (dto == null) {
      throw new NotFoundException("Personnel not found");
    }
    return dto;
  }

  @DeleteMapping("/{id}")
  public java.util.Map<String, Object> delete(@PathVariable Long id) {
    boolean ok = personnelService.delete(id);
    if (!ok) {
      throw new NotFoundException("Personnel not found");
    }
    return java.util.Map.of("success", true);
  }

  @GetMapping("/export")
  public ResponseEntity<String> exportCsv(@RequestParam(required = false) PersonnelType type) throws IOException {
    String csv = personnelService.exportCsv(type);
    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=personnel.csv")
        .contentType(MediaType.parseMediaType("text/csv"))
        .body(csv);
  }

  @PostMapping(value = "/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public java.util.Map<String, Object> importCsv(@RequestParam("file") MultipartFile file) throws IOException {
    int count = personnelService.importCsv(file);
    return java.util.Map.of("success", true, "count", count);
  }

  private static class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
      super(message);
    }
  }
}
