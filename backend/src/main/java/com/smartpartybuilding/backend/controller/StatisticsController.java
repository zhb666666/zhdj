package com.smartpartybuilding.backend.controller;

import com.smartpartybuilding.backend.dto.StatisticsOverviewDto;
import com.smartpartybuilding.backend.service.StatisticsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/statistics")
public class StatisticsController {
  private final StatisticsService statisticsService;

  public StatisticsController(StatisticsService statisticsService) {
    this.statisticsService = statisticsService;
  }

  @GetMapping("/overview")
  public StatisticsOverviewDto overview() {
    return statisticsService.overview();
  }
}
