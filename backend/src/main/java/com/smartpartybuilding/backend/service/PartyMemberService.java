package com.smartpartybuilding.backend.service;

import com.smartpartybuilding.backend.dto.PageResponse;
import com.smartpartybuilding.backend.dto.PartyMemberDto;
import com.smartpartybuilding.backend.dto.PartyMemberUpsertRequest;
import com.smartpartybuilding.backend.entity.Organization;
import com.smartpartybuilding.backend.entity.PartyMember;
import com.smartpartybuilding.backend.repository.OrganizationRepository;
import com.smartpartybuilding.backend.repository.PartyMemberRepository;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class PartyMemberService {
  private final PartyMemberRepository partyMemberRepository;
  private final OrganizationRepository organizationRepository;

  public PartyMemberService(PartyMemberRepository partyMemberRepository, OrganizationRepository organizationRepository) {
    this.partyMemberRepository = partyMemberRepository;
    this.organizationRepository = organizationRepository;
  }

  @Transactional(readOnly = true)
  public PageResponse<PartyMemberDto> list(String name, String memberType, Long organizationId, int page, int size) {
    Specification<PartyMember> spec = Specification.where(null);
    if (name != null && !name.isBlank()) {
      spec = spec.and((root, query, cb) -> cb.like(root.get("name"), "%" + name.trim() + "%"));
    }
    if (memberType != null && !memberType.isBlank()) {
      spec = spec.and((root, query, cb) -> cb.equal(root.get("memberType"), memberType.trim()));
    }
    if (organizationId != null) {
      spec = spec.and((root, query, cb) -> cb.equal(root.get("organizationId"), organizationId));
    }

    Page<PartyMember> result = partyMemberRepository.findAll(spec, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id")));
    List<PartyMemberDto> items = result.getContent().stream().map(this::toDto).toList();

    return new PageResponse<>(items, result.getTotalElements(), page, size);
  }

  @Transactional(readOnly = true)
  public PartyMemberDto get(Long id) {
    PartyMember m = partyMemberRepository.findById(id).orElse(null);
    return m == null ? null : toDto(m);
  }

  @Transactional
  public PartyMemberDto create(PartyMemberUpsertRequest req) {
    PartyMember m = new PartyMember();
    apply(m, req);
    return toDto(partyMemberRepository.save(m));
  }

  @Transactional
  public PartyMemberDto update(Long id, PartyMemberUpsertRequest req) {
    PartyMember m = partyMemberRepository.findById(id).orElse(null);
    if (m == null) {
      return null;
    }
    apply(m, req);
    return toDto(partyMemberRepository.save(m));
  }

  @Transactional
  public boolean delete(Long id) {
    if (!partyMemberRepository.existsById(id)) {
      return false;
    }
    partyMemberRepository.deleteById(id);
    return true;
  }

  @Transactional(readOnly = true)
  public String exportCsv(Long organizationId) throws IOException {
    List<PartyMember> items = organizationId == null
        ? partyMemberRepository.findAll()
        : partyMemberRepository.findAll((root, query, cb) -> cb.equal(root.get("organizationId"), organizationId));

    StringBuilder out = new StringBuilder();
    try (CSVPrinter printer = new CSVPrinter(out, CSVFormat.DEFAULT.builder()
        .setHeader("id", "name", "gender", "ethnic", "idCard", "phone", "organizationId", "position", "guideEnterprise", "memberType")
        .build())) {
      for (PartyMember m : items) {
        printer.printRecord(m.getId(), m.getName(), m.getGender(), m.getEthnic(), m.getIdCard(), m.getPhone(), m.getOrganizationId(), m.getPosition(), m.getGuideEnterprise(), m.getMemberType());
      }
    }

    return out.toString();
  }

  @Transactional
  public int importCsv(MultipartFile file) throws IOException {
    try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8));
        CSVParser parser = CSVFormat.DEFAULT.builder().setHeader().setSkipHeaderRecord(true).build().parse(reader)) {
      int count = 0;
      for (var record : parser) {
        PartyMember m = new PartyMember();
        m.setName(record.get("name"));
        m.setGender(record.get("gender"));
        m.setEthnic(record.get("ethnic"));
        m.setIdCard(record.get("idCard"));
        m.setPhone(record.get("phone"));
        String orgId = record.get("organizationId");
        if (orgId != null && !orgId.isBlank()) {
          m.setOrganizationId(Long.parseLong(orgId));
        }
        m.setPosition(record.get("position"));
        m.setGuideEnterprise(record.get("guideEnterprise"));
        m.setMemberType(record.get("memberType"));
        partyMemberRepository.save(m);
        count++;
      }
      return count;
    }
  }

  private void apply(PartyMember m, PartyMemberUpsertRequest req) {
    m.setName(req.name());
    m.setGender(req.gender());
    m.setEthnic(req.ethnic());
    m.setIdCard(req.idCard());
    m.setPhone(req.phone());
    m.setOrganizationId(req.organizationId());
    m.setPosition(req.position());
    m.setGuideEnterprise(req.guideEnterprise());
    m.setMemberType(req.memberType());
  }

  private PartyMemberDto toDto(PartyMember m) {
    String orgName = null;
    if (m.getOrganizationId() != null) {
      Organization org = organizationRepository.findById(m.getOrganizationId()).orElse(null);
      if (org != null) {
        orgName = org.getName();
      }
    }

    return new PartyMemberDto(
        m.getId(),
        m.getName(),
        m.getGender(),
        m.getEthnic(),
        m.getIdCard(),
        m.getPhone(),
        m.getOrganizationId(),
        orgName,
        m.getPosition(),
        m.getGuideEnterprise(),
        m.getMemberType());
  }
}
