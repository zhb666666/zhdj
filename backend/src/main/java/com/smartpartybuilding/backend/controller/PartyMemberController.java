package com.smartpartybuilding.backend.controller;

import com.smartpartybuilding.backend.dto.PageResponse;
import com.smartpartybuilding.backend.dto.PartyMemberDto;
import com.smartpartybuilding.backend.dto.PartyMemberUpsertRequest;
import com.smartpartybuilding.backend.service.PartyMemberService;
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
@RequestMapping("/members")
public class PartyMemberController {
  private final PartyMemberService partyMemberService;

  public PartyMemberController(PartyMemberService partyMemberService) {
    this.partyMemberService = partyMemberService;
  }

  @GetMapping
  public PageResponse<PartyMemberDto> list(
      @RequestParam(required = false) String name,
      @RequestParam(required = false) String memberType,
      @RequestParam(required = false) Long organizationId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    return partyMemberService.list(name, memberType, organizationId, page, size);
  }

  @GetMapping("/{id}")
  public PartyMemberDto detail(@PathVariable Long id) {
    PartyMemberDto dto = partyMemberService.get(id);
    if (dto == null) {
      throw new NotFoundException("Member not found");
    }
    return dto;
  }

  @PostMapping
  public PartyMemberDto create(@Valid @RequestBody PartyMemberUpsertRequest request) {
    return partyMemberService.create(request);
  }

  @PutMapping("/{id}")
  public PartyMemberDto update(@PathVariable Long id, @Valid @RequestBody PartyMemberUpsertRequest request) {
    PartyMemberDto dto = partyMemberService.update(id, request);
    if (dto == null) {
      throw new NotFoundException("Member not found");
    }
    return dto;
  }

  @DeleteMapping("/{id}")
  public java.util.Map<String, Object> delete(@PathVariable Long id) {
    boolean ok = partyMemberService.delete(id);
    if (!ok) {
      throw new NotFoundException("Member not found");
    }
    return java.util.Map.of("success", true);
  }

  @GetMapping("/export")
  public ResponseEntity<String> exportCsv(@RequestParam(required = false) Long organizationId) throws IOException {
    String csv = partyMemberService.exportCsv(organizationId);
    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=party_members.csv")
        .contentType(MediaType.parseMediaType("text/csv"))
        .body(csv);
  }

  @PostMapping(value = "/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public java.util.Map<String, Object> importCsv(@RequestParam("file") MultipartFile file) throws IOException {
    int count = partyMemberService.importCsv(file);
    return java.util.Map.of("success", true, "count", count);
  }

  private static class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
      super(message);
    }
  }
}
