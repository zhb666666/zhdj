package com.smartpartybuilding.backend.repository;

import com.smartpartybuilding.backend.entity.Attachment;
import com.smartpartybuilding.backend.entity.AttachmentBusinessType;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
  List<Attachment> findByBusinessTypeAndBusinessId(AttachmentBusinessType type, Long businessId);

  List<Attachment> findByBusinessTypeAndBusinessIdIsNull(AttachmentBusinessType type);
}
