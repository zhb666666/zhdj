import { SecurityConfig } from '../../config/security.config';
import { DataEncryption } from './data-encryption';
import { AuditLogger } from './audit-logger';

export class SecurityManager {
  constructor() {
    this.auditLogger = new AuditLogger();
    this.requestQueue = new Map();
    this.rateLimitMap = new Map();
  }

  validatePermission(userRole, requiredPermission) {
    if (!userRole) {
      this.auditLogger.logPermissionDenied(
        requiredPermission,
        'access',
        '用户未登录'
      );
      return false;
    }

    const rolePermissions = SecurityConfig.permissions.roles[userRole];
    
    if (!rolePermissions) {
      this.auditLogger.logPermissionDenied(
        requiredPermission,
        'access',
        '无效的用户角色'
      );
      return false;
    }

    if (rolePermissions.includes('*')) {
      return true;
    }

    const hasPermission = rolePermissions.includes(requiredPermission);
    
    if (!hasPermission) {
      this.auditLogger.logPermissionDenied(
        requiredPermission,
        'access',
        '权限不足'
      );
    }

    return hasPermission;
  }

  checkRateLimit(userId) {
    if (!SecurityConfig.apiSecurity.rateLimiting.enabled) {
      return true;
    }

    const now = Date.now();
    const windowMs = SecurityConfig.apiSecurity.rateLimiting.windowMs;
    const maxRequests = SecurityConfig.apiSecurity.rateLimiting.maxRequests;

    if (!this.rateLimitMap.has(userId)) {
      this.rateLimitMap.set(userId, []);
    }

    const userRequests = this.rateLimitMap.get(userId);
    const recentRequests = userRequests.filter(time => now - time < windowMs);

    if (recentRequests.length >= maxRequests) {
      this.auditLogger.logSecurityEvent(
        'RATE_LIMIT_EXCEEDED',
        'warn',
        {
          userId,
          requestCount: recentRequests.length,
          windowMs
        }
      );
      return false;
    }

    recentRequests.push(now);
    this.rateLimitMap.set(userId, recentRequests);

    return true;
  }

  validateInput(input, rules = {}) {
    const errors = [];

    if (rules.required && !input) {
      errors.push('此字段为必填项');
    }

    if (input) {
      const sanitized = DataEncryption.sanitizeInput(input);
      
      if (sanitized !== input) {
        this.auditLogger.logSecurityEvent(
          'SUSPICIOUS_INPUT_DETECTED',
          'warn',
          {
            originalLength: input.length,
            sanitizedLength: sanitized.length
          }
        );
      }

      if (rules.minLength && sanitized.length < rules.minLength) {
        errors.push(`最小长度为 ${rules.minLength} 个字符`);
      }

      if (rules.maxLength && sanitized.length > rules.maxLength) {
        errors.push(`最大长度为 ${rules.maxLength} 个字符`);
      }

      if (rules.pattern && !rules.pattern.test(sanitized)) {
        errors.push('格式不正确');
      }

      if (rules.custom && typeof rules.custom === 'function') {
        const customError = rules.custom(sanitized);
        if (customError) {
          errors.push(customError);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      sanitized: input ? DataEncryption.sanitizeInput(input) : input
    };
  }

  validateIdCard(idCard) {
    const pattern = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
    return pattern.test(idCard);
  }

  validatePhone(phone) {
    const pattern = /^1[3-9]\d{9}$/;
    return pattern.test(phone);
  }

  validateEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  encryptSensitiveData(data, sensitiveFields = []) {
    if (!data) return data;

    const encrypted = { ...data };
    const allSensitiveFields = [
      ...SecurityConfig.dataProtection.sensitiveFields,
      ...sensitiveFields
    ];

    allSensitiveFields.forEach(field => {
      if (encrypted[field]) {
        encrypted[field] = DataEncryption.encrypt(encrypted[field]);
      }
    });

    return encrypted;
  }

  decryptSensitiveData(data, sensitiveFields = []) {
    if (!data) return data;

    const decrypted = { ...data };
    const allSensitiveFields = [
      ...SecurityConfig.dataProtection.sensitiveFields,
      ...sensitiveFields
    ];

    allSensitiveFields.forEach(field => {
      if (decrypted[field]) {
        try {
          decrypted[field] = DataEncryption.decrypt(decrypted[field]);
        } catch (error) {
          console.error(`解密字段 ${field} 失败:`, error);
        }
      }
    });

    return decrypted;
  }

  maskSensitiveDataForDisplay(data) {
    if (!data) return data;

    const masked = { ...data };

    Object.keys(masked).forEach(field => {
      if (SecurityConfig.dataProtection.sensitiveFields.includes(field)) {
        masked[field] = DataEncryption.maskSensitiveData(masked[field], field);
      }
    });

    return masked;
  }

  generateSecureRequest(url, data = {}, method = 'POST') {
    const app = getApp();
    const token = app.globalData.token;
    const userId = app.globalData.userInfo?.id;

    if (!this.checkRateLimit(userId || 'anonymous')) {
      throw new Error('请求过于频繁，请稍后再试');
    }

    const timestamp = Date.now();
    const nonce = DataEncryption.generateKey(16);
    
    const signature = DataEncryption.hashData({
      url,
      data,
      timestamp,
      nonce,
      token
    });

    return {
      url,
      method,
      data: DataEncryption.encrypt(data),
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Timestamp': timestamp,
        'X-Nonce': nonce,
        'X-Signature': signature
      },
      timeout: SecurityConfig.apiSecurity.requestTimeout
    };
  }

  validateResponse(response) {
    if (!response) {
      throw new Error('响应数据为空');
    }

    if (response.statusCode === 401) {
      this.handleUnauthorized();
      throw new Error('未授权，请重新登录');
    }

    if (response.statusCode === 403) {
      this.auditLogger.logPermissionDenied(
        'resource',
        'access',
        '服务器拒绝访问'
      );
      throw new Error('无权访问此资源');
    }

    if (response.statusCode >= 400) {
      throw new Error(response.data?.message || '请求失败');
    }

    return response.data;
  }

  handleUnauthorized() {
    const app = getApp();
    
    this.auditLogger.log({
      action: 'TOKEN_EXPIRED',
      module: 'authentication',
      level: 'warn'
    });

    app.clearLoginStatus();

    wx.showModal({
      title: '登录已过期',
      content: '您的登录已过期，请重新登录',
      showCancel: false,
      success: () => {
        wx.reLaunch({
          url: '/pages/login/login'
        });
      }
    });
  }

  checkDataConsent(userId, dataType) {
    const consentKey = `consent_${userId}_${dataType}`;
    const consent = wx.getStorageSync(consentKey);
    
    if (!consent) {
      return false;
    }

    const consentData = JSON.parse(consent);
    const now = Date.now();
    const consentAge = now - consentData.timestamp;
    const maxAge = SecurityConfig.compliance.retentionPeriod[dataType] * 24 * 60 * 60 * 1000;

    return consentAge < maxAge;
  }

  recordDataConsent(userId, dataType, consented = true) {
    const consentKey = `consent_${userId}_${dataType}`;
    const consentData = {
      userId,
      dataType,
      consented,
      timestamp: Date.now(),
      version: '1.0'
    };

    wx.setStorageSync(consentKey, JSON.stringify(consentData));

    this.auditLogger.log({
      action: 'DATA_CONSENT',
      module: 'compliance',
      level: 'info',
      details: {
        userId,
        dataType,
        consented
      }
    });
  }

  enforceDataRetention() {
    const retentionPeriod = SecurityConfig.compliance.retentionPeriod;
    
    this.auditLogger.clearOldLogs(retentionPeriod.audit);

    this.auditLogger.log({
      action: 'DATA_RETENTION_ENFORCED',
      module: 'compliance',
      level: 'info',
      details: { retentionPeriod }
    });
  }

  performSecurityCheck() {
    const checks = {
      storageEncryption: this.checkStorageEncryption(),
      validToken: this.checkTokenValidity(),
      auditEnabled: SecurityConfig.audit.enabled,
      consentRequired: SecurityConfig.compliance.consentRequired
    };

    const allPassed = Object.values(checks).every(check => check === true);

    this.auditLogger.logSecurityEvent(
      'SECURITY_CHECK',
      allPassed ? 'info' : 'warn',
      { checks, passed: allPassed }
    );

    return { passed: allPassed, checks };
  }

  checkStorageEncryption() {
    return SecurityConfig.storage.encryptSensitiveData;
  }

  checkTokenValidity() {
    const app = getApp();
    const token = app.globalData.token;
    
    if (!token) return false;

    try {
      const tokenData = DataEncryption.validateToken(token);
      return tokenData !== null;
    } catch {
      return false;
    }
  }
}

export default SecurityManager;
