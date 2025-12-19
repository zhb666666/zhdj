package com.smartpartybuilding.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

@Entity
@Table(name = "party_members", indexes = {
    @Index(name = "idx_member_org", columnList = "organizationId"),
    @Index(name = "idx_member_id_card", columnList = "idCard")
})
public class PartyMember extends BaseEntity {
  @Column(nullable = false, length = 50)
  private String name;

  @Column(length = 10)
  private String gender;

  @Column(length = 20)
  private String ethnic;

  @Column(nullable = false, length = 20)
  private String idCard;

  @Column(length = 20)
  private String phone;

  private Long organizationId;

  @Column(length = 50)
  private String position;

  @Column(length = 100)
  private String guideEnterprise;

  @Column(length = 50)
  private String memberType;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getGender() {
    return gender;
  }

  public void setGender(String gender) {
    this.gender = gender;
  }

  public String getEthnic() {
    return ethnic;
  }

  public void setEthnic(String ethnic) {
    this.ethnic = ethnic;
  }

  public String getIdCard() {
    return idCard;
  }

  public void setIdCard(String idCard) {
    this.idCard = idCard;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public Long getOrganizationId() {
    return organizationId;
  }

  public void setOrganizationId(Long organizationId) {
    this.organizationId = organizationId;
  }

  public String getPosition() {
    return position;
  }

  public void setPosition(String position) {
    this.position = position;
  }

  public String getGuideEnterprise() {
    return guideEnterprise;
  }

  public void setGuideEnterprise(String guideEnterprise) {
    this.guideEnterprise = guideEnterprise;
  }

  public String getMemberType() {
    return memberType;
  }

  public void setMemberType(String memberType) {
    this.memberType = memberType;
  }
}
