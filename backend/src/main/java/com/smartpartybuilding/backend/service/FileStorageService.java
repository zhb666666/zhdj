package com.smartpartybuilding.backend.service;

import com.smartpartybuilding.backend.config.AppProperties;
import com.smartpartybuilding.backend.entity.Attachment;
import com.smartpartybuilding.backend.entity.AttachmentBusinessType;
import com.smartpartybuilding.backend.repository.AttachmentRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {
  private final AppProperties appProperties;
  private final AttachmentRepository attachmentRepository;

  public FileStorageService(AppProperties appProperties, AttachmentRepository attachmentRepository) {
    this.appProperties = appProperties;
    this.attachmentRepository = attachmentRepository;
  }

  @Transactional
  public Attachment store(MultipartFile file, AttachmentBusinessType businessType) throws IOException {
    Path uploadDir = Path.of(appProperties.storage().uploadDir()).toAbsolutePath().normalize();
    Files.createDirectories(uploadDir);

    String originalName = file.getOriginalFilename() == null ? "file" : file.getOriginalFilename();
    String ext = "";
    int dot = originalName.lastIndexOf('.');
    if (dot >= 0 && dot < originalName.length() - 1) {
      ext = originalName.substring(dot);
    }

    String storedName = UUID.randomUUID() + ext;
    Path target = uploadDir.resolve(storedName);
    Files.copy(file.getInputStream(), target);

    Attachment attachment = new Attachment();
    attachment.setBusinessType(businessType);
    attachment.setBusinessId(null);
    attachment.setOriginalName(originalName);
    attachment.setStoredName(storedName);
    attachment.setContentType(file.getContentType());
    attachment.setSize(file.getSize());
    attachment.setUrl("/files/" + storedName);

    return attachmentRepository.save(attachment);
  }

  @Transactional
  public void linkAttachments(AttachmentBusinessType type, Long businessId, java.util.List<Long> attachmentIds) {
    if (attachmentIds == null || attachmentIds.isEmpty()) {
      return;
    }

    for (Long attachmentId : attachmentIds) {
      Attachment attachment = attachmentRepository.findById(attachmentId).orElse(null);
      if (attachment == null) {
        continue;
      }
      if (attachment.getBusinessType() != type) {
        continue;
      }
      attachment.setBusinessId(businessId);
      attachmentRepository.save(attachment);
    }
  }
}
