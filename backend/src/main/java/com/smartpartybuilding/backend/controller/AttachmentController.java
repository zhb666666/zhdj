package com.smartpartybuilding.backend.controller;

import com.smartpartybuilding.backend.dto.AttachmentDto;
import com.smartpartybuilding.backend.entity.Attachment;
import com.smartpartybuilding.backend.entity.AttachmentBusinessType;
import com.smartpartybuilding.backend.service.FileStorageService;
import java.io.IOException;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping
public class AttachmentController {
  private final FileStorageService fileStorageService;

  public AttachmentController(FileStorageService fileStorageService) {
    this.fileStorageService = fileStorageService;
  }

  @PostMapping(value = "/opinions/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public AttachmentDto uploadOpinionAttachment(@RequestParam("file") MultipartFile file) throws IOException {
    Attachment attachment = fileStorageService.store(file, AttachmentBusinessType.opinion);
    return AttachmentDto.fromEntity(attachment);
  }

  @PostMapping(value = "/notices/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public AttachmentDto uploadNoticeAttachment(@RequestParam("file") MultipartFile file) throws IOException {
    Attachment attachment = fileStorageService.store(file, AttachmentBusinessType.notice);
    return AttachmentDto.fromEntity(attachment);
  }

  @PostMapping(value = "/news/icon", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public AttachmentDto uploadNewsIcon(@RequestParam("file") MultipartFile file) throws IOException {
    Attachment attachment = fileStorageService.store(file, AttachmentBusinessType.news);
    return AttachmentDto.fromEntity(attachment);
  }
}
