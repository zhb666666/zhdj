package com.smartpartybuilding.backend.service;

import com.smartpartybuilding.backend.dto.PageResponse;
import com.smartpartybuilding.backend.dto.PersonnelDto;
import com.smartpartybuilding.backend.dto.PersonnelUpsertRequest;
import com.smartpartybuilding.backend.entity.Personnel;
import com.smartpartybuilding.backend.entity.PersonnelType;
import com.smartpartybuilding.backend.repository.PersonnelRepository;
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
public class PersonnelService {
  private final PersonnelRepository personnelRepository;

  public PersonnelService(PersonnelRepository personnelRepository) {
    this.personnelRepository = personnelRepository;
  }

  @Transactional(readOnly = true)
  public PageResponse<PersonnelDto> list(PersonnelType type, String name, int page, int size) {
    Specification<Personnel> spec = Specification.where(null);
    if (type != null) {
      spec = spec.and((root, query, cb) -> cb.equal(root.get("type"), type));
    }
    if (name != null && !name.isBlank()) {
      spec = spec.and((root, query, cb) -> cb.like(root.get("name"), "%" + name.trim() + "%"));
    }

    Page<Personnel> result = personnelRepository.findAll(spec, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id")));
    List<PersonnelDto> items = result.getContent().stream().map(this::toDto).toList();

    return new PageResponse<>(items, result.getTotalElements(), page, size);
  }

  @Transactional(readOnly = true)
  public PersonnelDto get(Long id) {
    Personnel p = personnelRepository.findById(id).orElse(null);
    return p == null ? null : toDto(p);
  }

  @Transactional
  public PersonnelDto create(PersonnelUpsertRequest req) {
    Personnel p = new Personnel();
    apply(p, req);
    return toDto(personnelRepository.save(p));
  }

  @Transactional
  public PersonnelDto update(Long id, PersonnelUpsertRequest req) {
    Personnel p = personnelRepository.findById(id).orElse(null);
    if (p == null) {
      return null;
    }
    apply(p, req);
    return toDto(personnelRepository.save(p));
  }

  @Transactional
  public boolean delete(Long id) {
    if (!personnelRepository.existsById(id)) {
      return false;
    }
    personnelRepository.deleteById(id);
    return true;
  }

  @Transactional(readOnly = true)
  public String exportCsv(PersonnelType type) throws IOException {
    List<Personnel> items = type == null ? personnelRepository.findAll() : personnelRepository.findAll((root, query, cb) -> cb.equal(root.get("type"), type));

    StringBuilder out = new StringBuilder();
    try (CSVPrinter printer = new CSVPrinter(out, CSVFormat.DEFAULT.builder()
        .setHeader("id", "type", "name", "position", "phone", "grid")
        .build())) {
      for (Personnel p : items) {
        printer.printRecord(p.getId(), p.getType(), p.getName(), p.getPosition(), p.getPhone(), p.getGrid());
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
        Personnel p = new Personnel();
        p.setType(PersonnelType.valueOf(record.get("type")));
        p.setName(record.get("name"));
        p.setPosition(record.get("position"));
        p.setPhone(record.get("phone"));
        p.setGrid(record.get("grid"));
        personnelRepository.save(p);
        count++;
      }
      return count;
    }
  }

  private void apply(Personnel p, PersonnelUpsertRequest req) {
    p.setType(req.type());
    p.setName(req.name());
    p.setPosition(req.position());
    p.setPhone(req.phone());
    p.setGrid(req.grid());
  }

  private PersonnelDto toDto(Personnel p) {
    return new PersonnelDto(p.getId(), p.getType(), p.getName(), p.getPosition(), p.getPhone(), p.getGrid());
  }
}
