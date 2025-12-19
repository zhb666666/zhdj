package com.smartpartybuilding.backend.service;

import com.smartpartybuilding.backend.dto.OrganizationDto;
import com.smartpartybuilding.backend.dto.OrganizationTreeNodeDto;
import com.smartpartybuilding.backend.dto.OrganizationUpsertRequest;
import com.smartpartybuilding.backend.entity.Organization;
import com.smartpartybuilding.backend.repository.OrganizationRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrganizationService {
  private final OrganizationRepository organizationRepository;

  public OrganizationService(OrganizationRepository organizationRepository) {
    this.organizationRepository = organizationRepository;
  }

  @Transactional(readOnly = true)
  public List<OrganizationDto> list() {
    return organizationRepository.findAll().stream().map(this::toDto).toList();
  }

  @Transactional(readOnly = true)
  public OrganizationDto get(Long id) {
    Organization org = organizationRepository.findById(id).orElse(null);
    return org == null ? null : toDto(org);
  }

  @Transactional
  public OrganizationDto create(OrganizationUpsertRequest req) {
    Organization org = new Organization();
    apply(org, req);
    return toDto(organizationRepository.save(org));
  }

  @Transactional
  public OrganizationDto update(Long id, OrganizationUpsertRequest req) {
    Organization org = organizationRepository.findById(id).orElse(null);
    if (org == null) {
      return null;
    }
    apply(org, req);
    return toDto(organizationRepository.save(org));
  }

  @Transactional
  public boolean delete(Long id) {
    if (!organizationRepository.existsById(id)) {
      return false;
    }
    organizationRepository.deleteById(id);
    return true;
  }

  @Transactional(readOnly = true)
  public List<OrganizationTreeNodeDto> tree() {
    List<Organization> all = organizationRepository.findAll();
    Map<Long, List<Organization>> childrenMap = new HashMap<>();
    List<Organization> roots = new ArrayList<>();

    for (Organization org : all) {
      if (org.getParentId() == null) {
        roots.add(org);
        continue;
      }
      childrenMap.computeIfAbsent(org.getParentId(), k -> new ArrayList<>()).add(org);
    }

    return roots.stream().map(r -> toTree(r, childrenMap)).toList();
  }

  private OrganizationTreeNodeDto toTree(Organization org, Map<Long, List<Organization>> childrenMap) {
    List<OrganizationTreeNodeDto> children = childrenMap.getOrDefault(org.getId(), List.of()).stream()
        .map(c -> toTree(c, childrenMap))
        .toList();

    return new OrganizationTreeNodeDto(org.getId(), org.getName(), org.getCode(), org.getCategory(), children);
  }

  private void apply(Organization org, OrganizationUpsertRequest req) {
    org.setName(req.name());
    org.setCode(req.code());
    org.setCategory(req.category());
    org.setParentId(req.parentId());
  }

  private OrganizationDto toDto(Organization org) {
    return new OrganizationDto(org.getId(), org.getName(), org.getCode(), org.getCategory(), org.getParentId());
  }
}
