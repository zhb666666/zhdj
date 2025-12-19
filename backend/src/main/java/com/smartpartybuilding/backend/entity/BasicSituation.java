package com.smartpartybuilding.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "basic_situation")
public class BasicSituation extends BaseEntity {
  @Column(nullable = false)
  private int keyEnterpriseCount;

  @Column(nullable = false)
  private int managedPartyOrgCount;

  @Column(nullable = false)
  private int managedMemberCount;

  @Column(nullable = false)
  private int highEndChemGridCount;

  public int getKeyEnterpriseCount() {
    return keyEnterpriseCount;
  }

  public void setKeyEnterpriseCount(int keyEnterpriseCount) {
    this.keyEnterpriseCount = keyEnterpriseCount;
  }

  public int getManagedPartyOrgCount() {
    return managedPartyOrgCount;
  }

  public void setManagedPartyOrgCount(int managedPartyOrgCount) {
    this.managedPartyOrgCount = managedPartyOrgCount;
  }

  public int getManagedMemberCount() {
    return managedMemberCount;
  }

  public void setManagedMemberCount(int managedMemberCount) {
    this.managedMemberCount = managedMemberCount;
  }

  public int getHighEndChemGridCount() {
    return highEndChemGridCount;
  }

  public void setHighEndChemGridCount(int highEndChemGridCount) {
    this.highEndChemGridCount = highEndChemGridCount;
  }
}
