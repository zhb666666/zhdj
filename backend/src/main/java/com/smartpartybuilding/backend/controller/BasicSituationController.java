package com.smartpartybuilding.backend.controller;

import com.smartpartybuilding.backend.dto.BasicSituationDto;
import com.smartpartybuilding.backend.dto.BasicSituationUpdateRequest;
import com.smartpartybuilding.backend.service.BasicSituationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/basic-situation")
public class BasicSituationController {
  private final BasicSituationService basicSituationService;

  public BasicSituationController(BasicSituationService basicSituationService) {
    this.basicSituationService = basicSituationService;
  }

  @GetMapping
  public BasicSituationDto get() {
    return basicSituationService.getCurrent();
  }

  @PutMapping
  public BasicSituationDto update(@RequestBody BasicSituationUpdateRequest request) {
    return basicSituationService.update(request);
  }
}
