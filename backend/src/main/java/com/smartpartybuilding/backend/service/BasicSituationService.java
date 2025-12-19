package com.smartpartybuilding.backend.service;

import com.smartpartybuilding.backend.dto.BasicSituationDto;
import com.smartpartybuilding.backend.dto.BasicSituationUpdateRequest;
import com.smartpartybuilding.backend.entity.BasicSituation;
import com.smartpartybuilding.backend.repository.BasicSituationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BasicSituationService {
  private final BasicSituationRepository basicSituationRepository;

  public BasicSituationService(BasicSituationRepository basicSituationRepository) {
    this.basicSituationRepository = basicSituationRepository;
  }

  @Transactional(readOnly = true)
  public BasicSituationDto getCurrent() {
    BasicSituation bs = basicSituationRepository.findAll().stream().findFirst().orElse(null);
    if (bs == null) {
      return new BasicSituationDto(null, 0, 0, 0, 0);
    }
    return toDto(bs);
  }

  @Transactional
  public BasicSituationDto update(BasicSituationUpdateRequest req) {
    BasicSituation bs = basicSituationRepository.findAll().stream().findFirst().orElse(null);
    if (bs == null) {
      bs = new BasicSituation();
    }
    bs.setKeyEnterpriseCount(req.keyEnterpriseCount());
    bs.setManagedPartyOrgCount(req.managedPartyOrgCount());
    bs.setManagedMemberCount(req.managedMemberCount());
    bs.setHighEndChemGridCount(req.highEndChemGridCount());

    return toDto(basicSituationRepository.save(bs));
  }

  private BasicSituationDto toDto(BasicSituation bs) {
    return new BasicSituationDto(bs.getId(), bs.getKeyEnterpriseCount(), bs.getManagedPartyOrgCount(), bs.getManagedMemberCount(), bs.getHighEndChemGridCount());
  }
}
