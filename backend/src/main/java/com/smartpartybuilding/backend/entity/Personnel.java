package com.smartpartybuilding.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

@Entity
@Table(name = "personnel", indexes = {
    @Index(name = "idx_personnel_type", columnList = "type")
})
public class Personnel extends BaseEntity {
  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 30)
  private PersonnelType type;

  @Column(nullable = false, length = 50)
  private String name;

  @Column(length = 50)
  private String position;

  @Column(length = 20)
  private String phone;

  @Column(length = 50)
  private String grid;

  public PersonnelType getType() {
    return type;
  }

  public void setType(PersonnelType type) {
    this.type = type;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getPosition() {
    return position;
  }

  public void setPosition(String position) {
    this.position = position;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public String getGrid() {
    return grid;
  }

  public void setGrid(String grid) {
    this.grid = grid;
  }
}
