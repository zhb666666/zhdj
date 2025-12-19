export const SecurityConfig = {
  encryption: {
    algorithm: 'AES-256-CBC',
    keySize: 256,
    ivSize: 128,
    saltSize: 64,
    iterations: 10000
  },

  session: {
    timeout: 7200000,
    renewThreshold: 600000,
    maxRetries: 3
  },

  dataProtection: {
    sensitiveFields: [
      'idCard',
      'phone',
      'password',
      'bankAccount',
      'address',
      'email'
    ],
    maskPatterns: {
      idCard: { start: 6, end: 14, mask: '*' },
      phone: { start: 3, end: 7, mask: '*' },
      bankAccount: { start: 4, end: -4, mask: '*' },
      email: { start: 2, end: '@', mask: '*' }
    }
  },

  apiSecurity: {
    requestTimeout: 30000,
    maxRequestSize: 10485760,
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    rateLimiting: {
      enabled: true,
      maxRequests: 100,
      windowMs: 60000
    }
  },

  audit: {
    enabled: true,
    logLevel: 'info',
    retention: 90,
    sensitiveActions: [
      'LOGIN',
      'LOGOUT',
      'DATA_EXPORT',
      'DATA_DELETE',
      'PERMISSION_CHANGE',
      'USER_CREATE',
      'USER_UPDATE',
      'USER_DELETE'
    ],
    localStorageKey: 'audit_logs',
    maxLocalLogs: 1000,
    syncInterval: 300000
  },

  validation: {
    input: {
      maxLength: 10000,
      allowedTags: [],
      blacklistPatterns: [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi
      ]
    }
  },

  storage: {
    encryptSensitiveData: true,
    storageKeys: {
      token: 'secure_token',
      userInfo: 'secure_user_info',
      audit: 'audit_logs'
    },
    maxStorageSize: 10485760
  },

  compliance: {
    laws: [
      '中华人民共和国网络安全法',
      '中华人民共和国数据安全法',
      '中华人民共和国个人信息保护法'
    ],
    dataCategories: {
      personal: ['姓名', '身份证号', '联系电话', '住址'],
      sensitive: ['政治面貌', '党员信息', '民族', '宗教信仰'],
      organizational: ['组织架构', '人员配置', '业务数据']
    },
    consentRequired: true,
    retentionPeriod: {
      personal: 2555,
      audit: 2555,
      business: 3650
    }
  },

  permissions: {
    roles: {
      admin: ['*'],
      park_manager: [
        'view_all_data',
        'manage_organizations',
        'manage_users',
        'publish_news',
        'view_statistics',
        'export_data'
      ],
      enterprise_manager: [
        'view_own_data',
        'submit_opinions',
        'view_announcements',
        'manage_own_members'
      ],
      member: [
        'view_public_data',
        'view_announcements',
        'view_news',
        'submit_opinions'
      ]
    }
  }
};

export default SecurityConfig;
