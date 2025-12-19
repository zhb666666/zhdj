package com.smartpartybuilding.backend.repository;

import com.smartpartybuilding.backend.entity.PartyMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PartyMemberRepository extends JpaRepository<PartyMember, Long>, JpaSpecificationExecutor<PartyMember> {}
