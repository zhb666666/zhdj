export class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.username = data.username || '';
    this.name = data.name || '';
    this.role = data.role || 'member';
    this.organizationId = data.organizationId || null;
    this.organizationName = data.organizationName || '';
    this.phone = data.phone || '';
    this.email = data.email || '';
    this.avatar = data.avatar || '';
    this.status = data.status || 'active';
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
    this.lastLoginAt = data.lastLoginAt || null;
  }

  static fromJSON(json) {
    return new User(json);
  }

  toJSON() {
    return {
      id: this.id,
      username: this.username,
      name: this.name,
      role: this.role,
      organizationId: this.organizationId,
      organizationName: this.organizationName,
      phone: this.phone,
      email: this.email,
      avatar: this.avatar,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastLoginAt: this.lastLoginAt
    };
  }

  hasRole(role) {
    if (Array.isArray(role)) {
      return role.includes(this.role);
    }
    return this.role === role;
  }

  isAdmin() {
    return this.role === 'admin';
  }

  isParkManager() {
    return this.role === 'park_manager';
  }

  isEnterpriseManager() {
    return this.role === 'enterprise_manager';
  }

  isMember() {
    return this.role === 'member';
  }

  isActive() {
    return this.status === 'active';
  }

  getMaskedPhone() {
    if (!this.phone || this.phone.length < 11) return this.phone;
    return this.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }

  getMaskedEmail() {
    if (!this.email) return '';
    const [local, domain] = this.email.split('@');
    if (local.length <= 2) return this.email;
    return `${local.substring(0, 2)}***@${domain}`;
  }
}

export default User;
