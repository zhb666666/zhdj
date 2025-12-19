package com.smartpartybuilding.backend.repository;

import com.smartpartybuilding.backend.entity.Organization;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
  Optional<Organization> findByCode(String code);

  List<Organization> findByParentId(Long parentId);
}
