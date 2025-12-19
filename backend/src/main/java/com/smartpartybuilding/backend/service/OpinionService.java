package com.smartpartybuilding.backend.service;

import com.smartpartybuilding.backend.dto.AttachmentDto;
import com.smartpartybuilding.backend.dto.OpinionDto;
import com.smartpartybuilding.backend.dto.OpinionUpsertRequest;
import com.smartpartybuilding.backend.dto.PageResponse;
import com.smartpartybuilding.backend.entity.AttachmentBusinessType;
import com.smartpartybuilding.backend.entity.Opinion;
import com.smartpartybuilding.backend.entity.Organization;
import com.smartpartybuilding.backend.repository.AttachmentRepository;
import com.smartpartybuilding.backend.repository.OpinionRepository;
import com.smartpartybuilding.backend.repository.OrganizationRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OpinionService {
  private final OpinionRepository opinionRepository;
  private final OrganizationRepository organizationRepository;
  private final AttachmentRepository attachmentRepository;
  private final FileStorageService fileStorageService;

  public OpinionService(
      OpinionRepository opinionRepository,
      OrganizationRepository organizationRepository,
      AttachmentRepository attachmentRepository,
      FileStorageService fileStorageService) {
    this.opinionRepository = opinionRepository;
    this.organizationRepository = organizationRepository;
    this.attachmentRepository = attachmentRepository;
    this.fileStorageService = fileStorageService;
  }

  @Transactional(readOnly = true)
  public PageResponse<OpinionDto> list(String subject, Long organizationId, LocalDateTime startTime, LocalDateTime endTime, int page, int size) {
    Specification<Opinion> spec = Specification.where(null);
    if (subject != null && !subject.isBlank()) {
      spec = spec.and((root, query, cb) -> cb.like(root.get("subject"), "%" + subject.trim() + "%"));
    }
    if (organizationId != null) {
      spec = spec.and((root, query, cb) -> cb.equal(root.get("organizationId"), organizationId));
    }
    if (startTime != null) {
      spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("submitTime"), startTime));
    }
    if (endTime != null) {
      spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("submitTime"), endTime));
    }

    Page<Opinion> result = opinionRepository.findAll(spec, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "submitTime")));

    List<OpinionDto> items = result.getContent().stream().map(this::toDto).toList();
    return new PageResponse<>(items, result.getTotalElements(), page, size);
  }

  @Transactional(readOnly = true)
  public OpinionDto get(Long id) {
    Opinion opinion = opinionRepository.findById(id).orElse(null);
    return opinion == null ? null : toDto(opinion);
  }

  @Transactional
  public OpinionDto create(OpinionUpsertRequest req) {
    Opinion opinion = new Opinion();
    apply(opinion, req);
    Opinion saved = opinionRepository.save(opinion);

    fileStorageService.linkAttachments(AttachmentBusinessType.opinion, saved.getId(), req.attachmentIds());

    return toDto(saved);
  }

  @Transactional
  public OpinionDto update(Long id, OpinionUpsertRequest req) {
    Opinion opinion = opinionRepository.findById(id).orElse(null);
    if (opinion == null) {
      return null;
    }

    apply(opinion, req);
    Opinion saved = opinionRepository.save(opinion);

    fileStorageService.linkAttachments(AttachmentBusinessType.opinion, saved.getId(), req.attachmentIds());

    return toDto(saved);
  }

  @Transactional
  public boolean delete(Long id) {
    if (!opinionRepository.existsById(id)) {
      return false;
    }
    opinionRepository.deleteById(id);
    return true;
  }

  private void apply(Opinion opinion, OpinionUpsertRequest req) {
    opinion.setSubject(req.subject());
    opinion.setContent(req.content());
    opinion.setPhone(req.phone());
    opinion.setOrganizationId(req.organizationId());
    opinion.setSubmitTime(req.submitTime());
    opinion.setSubmitterId(req.submitterId());
    opinion.setSubmitterName(req.submitterName());
  }

  private OpinionDto toDto(Opinion opinion) {
    String orgName = null;
    if (opinion.getOrganizationId() != null) {
      Organization org = organizationRepository.findById(opinion.getOrganizationId()).orElse(null);
      if (org != null) {
        orgName = org.getName();
      }
    }

    List<AttachmentDto> attachments = attachmentRepository
        .findByBusinessTypeAndBusinessId(AttachmentBusinessType.opinion, opinion.getId())
        .stream()
        .map(AttachmentDto::fromEntity)
        .toList();

    return new OpinionDto(
        opinion.getId(),
        opinion.getSubject(),
        opinion.getContent(),
        opinion.getOrganizationId(),
        orgName,
        opinion.getSubmitTime(),
        opinion.getSubmitterId(),
        opinion.getSubmitterName(),
        opinion.getPhone(),
        attachments);
  }
}
