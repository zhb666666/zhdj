export class Member {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.gender = data.gender || '';
    this.nation = data.nation || '';
    this.idCard = data.idCard || '';
    this.phone = data.phone || '';
    this.email = data.email || '';
    this.organizationId = data.organizationId || null;
    this.organizationName = data.organizationName || '';
    this.position = data.position || '';
    this.category = data.category || '';
    this.joinDate = data.joinDate || null;
    this.partyJoinDate = data.partyJoinDate || null;
    this.politicalStatus = data.politicalStatus || '';
    this.education = data.education || '';
    this.address = data.address || '';
    this.avatar = data.avatar || '';
    this.status = data.status || 'active';
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  static fromJSON(json) {
    return new Member(json);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      gender: this.gender,
      nation: this.nation,
      idCard: this.idCard,
      phone: this.phone,
      email: this.email,
      organizationId: this.organizationId,
      organizationName: this.organizationName,
      position: this.position,
      category: this.category,
      joinDate: this.joinDate,
      partyJoinDate: this.partyJoinDate,
      politicalStatus: this.politicalStatus,
      education: this.education,
      address: this.address,
      avatar: this.avatar,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  getMaskedIdCard() {
    if (!this.idCard || this.idCard.length < 18) return this.idCard;
    return this.idCard.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2');
  }

  getMaskedPhone() {
    if (!this.phone || this.phone.length < 11) return this.phone;
    return this.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }

  getAge() {
    if (!this.idCard || this.idCard.length < 18) return null;
    const birthYear = parseInt(this.idCard.substring(6, 10));
    const birthMonth = parseInt(this.idCard.substring(10, 12));
    const birthDay = parseInt(this.idCard.substring(12, 14));
    
    const today = new Date();
    let age = today.getFullYear() - birthYear;
    
    if (today.getMonth() + 1 < birthMonth || 
        (today.getMonth() + 1 === birthMonth && today.getDate() < birthDay)) {
      age--;
    }
    
    return age;
  }

  getGenderFromIdCard() {
    if (!this.idCard || this.idCard.length < 17) return null;
    const genderCode = parseInt(this.idCard.substring(16, 17));
    return genderCode % 2 === 0 ? '女' : '男';
  }

  getPartyAge() {
    if (!this.partyJoinDate) return null;
    
    const joinDate = new Date(this.partyJoinDate);
    const today = new Date();
    
    let years = today.getFullYear() - joinDate.getFullYear();
    if (today.getMonth() < joinDate.getMonth() ||
        (today.getMonth() === joinDate.getMonth() && today.getDate() < joinDate.getDate())) {
      years--;
    }
    
    return years;
  }

  isActive() {
    return this.status === 'active';
  }
}

export default Member;
