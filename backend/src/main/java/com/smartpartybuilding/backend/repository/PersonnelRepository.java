package com.smartpartybuilding.backend.repository;

import com.smartpartybuilding.backend.entity.Personnel;
import com.smartpartybuilding.backend.entity.PersonnelType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PersonnelRepository extends JpaRepository<Personnel, Long>, JpaSpecificationExecutor<Personnel> {
  long countByType(PersonnelType type);
}
