package com.smartpartybuilding.backend.service;

import com.smartpartybuilding.backend.dto.StatisticsOverviewDto;
import com.smartpartybuilding.backend.entity.PersonnelType;
import com.smartpartybuilding.backend.repository.NewsRepository;
import com.smartpartybuilding.backend.repository.NoticeRepository;
import com.smartpartybuilding.backend.repository.OpinionRepository;
import com.smartpartybuilding.backend.repository.OrganizationRepository;
import com.smartpartybuilding.backend.repository.PartyMemberRepository;
import com.smartpartybuilding.backend.repository.PersonnelRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StatisticsService {
  private final OpinionRepository opinionRepository;
  private final NoticeRepository noticeRepository;
  private final NewsRepository newsRepository;
  private final OrganizationRepository organizationRepository;
  private final PartyMemberRepository partyMemberRepository;
  private final PersonnelRepository personnelRepository;

  public StatisticsService(
      OpinionRepository opinionRepository,
      NoticeRepository noticeRepository,
      NewsRepository newsRepository,
      OrganizationRepository organizationRepository,
      PartyMemberRepository partyMemberRepository,
      PersonnelRepository personnelRepository) {
    this.opinionRepository = opinionRepository;
    this.noticeRepository = noticeRepository;
    this.newsRepository = newsRepository;
    this.organizationRepository = organizationRepository;
    this.partyMemberRepository = partyMemberRepository;
    this.personnelRepository = personnelRepository;
  }

  @Transactional(readOnly = true)
  public StatisticsOverviewDto overview() {
    return new StatisticsOverviewDto(
        opinionRepository.count(),
        noticeRepository.count(),
        newsRepository.count(),
        organizationRepository.count(),
        partyMemberRepository.count(),
        personnelRepository.countByType(PersonnelType.advisor),
        personnelRepository.countByType(PersonnelType.grid_member));
  }
}
