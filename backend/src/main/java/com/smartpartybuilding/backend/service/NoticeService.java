package com.smartpartybuilding.backend.service;

import com.smartpartybuilding.backend.dto.AttachmentDto;
import com.smartpartybuilding.backend.dto.NoticeDto;
import com.smartpartybuilding.backend.dto.NoticeUpsertRequest;
import com.smartpartybuilding.backend.dto.PageResponse;
import com.smartpartybuilding.backend.entity.AttachmentBusinessType;
import com.smartpartybuilding.backend.entity.Notice;
import com.smartpartybuilding.backend.repository.AttachmentRepository;
import com.smartpartybuilding.backend.repository.NoticeRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NoticeService {
  private final NoticeRepository noticeRepository;
  private final AttachmentRepository attachmentRepository;
  private final FileStorageService fileStorageService;

  public NoticeService(NoticeRepository noticeRepository, AttachmentRepository attachmentRepository, FileStorageService fileStorageService) {
    this.noticeRepository = noticeRepository;
    this.attachmentRepository = attachmentRepository;
    this.fileStorageService = fileStorageService;
  }

  @Transactional(readOnly = true)
  public PageResponse<NoticeDto> list(String name, LocalDateTime startTime, LocalDateTime endTime, int page, int size) {
    Specification<Notice> spec = Specification.where(null);
    if (name != null && !name.isBlank()) {
      spec = spec.and((root, query, cb) -> cb.like(root.get("name"), "%" + name.trim() + "%"));
    }
    if (startTime != null) {
      spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("publishTime"), startTime));
    }
    if (endTime != null) {
      spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("publishTime"), endTime));
    }

    Page<Notice> result = noticeRepository.findAll(spec, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishTime")));
    List<NoticeDto> items = result.getContent().stream().map(this::toDto).toList();

    return new PageResponse<>(items, result.getTotalElements(), page, size);
  }

  @Transactional(readOnly = true)
  public NoticeDto get(Long id) {
    Notice notice = noticeRepository.findById(id).orElse(null);
    return notice == null ? null : toDto(notice);
  }

  @Transactional
  public NoticeDto create(NoticeUpsertRequest req) {
    Notice notice = new Notice();
    apply(notice, req);
    Notice saved = noticeRepository.save(notice);

    fileStorageService.linkAttachments(AttachmentBusinessType.notice, saved.getId(), req.attachmentIds());
    return toDto(saved);
  }

  @Transactional
  public NoticeDto update(Long id, NoticeUpsertRequest req) {
    Notice notice = noticeRepository.findById(id).orElse(null);
    if (notice == null) {
      return null;
    }
    apply(notice, req);
    Notice saved = noticeRepository.save(notice);

    fileStorageService.linkAttachments(AttachmentBusinessType.notice, saved.getId(), req.attachmentIds());
    return toDto(saved);
  }

  @Transactional
  public boolean delete(Long id) {
    if (!noticeRepository.existsById(id)) {
      return false;
    }
    noticeRepository.deleteById(id);
    return true;
  }

  private void apply(Notice notice, NoticeUpsertRequest req) {
    notice.setName(req.name());
    notice.setPublishTime(req.publishTime());
    notice.setContent(req.content());
  }

  private NoticeDto toDto(Notice notice) {
    List<AttachmentDto> attachments = attachmentRepository
        .findByBusinessTypeAndBusinessId(AttachmentBusinessType.notice, notice.getId())
        .stream()
        .map(AttachmentDto::fromEntity)
        .toList();

    return new NoticeDto(notice.getId(), notice.getName(), notice.getPublishTime(), notice.getContent(), attachments);
  }
}
