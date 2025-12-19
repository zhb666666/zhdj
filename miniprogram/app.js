import { SecurityManager } from './utils/security/security-manager';
import { DataEncryption } from './utils/security/data-encryption';
import { AuditLogger } from './utils/security/audit-logger';

App({
  globalData: {
    userInfo: null,
    token: null,
    role: null,
    organizationId: null,
    securityManager: null,
    auditLogger: null
  },

  onLaunch(options) {
    console.log('智慧党建小程序启动', options);
    
    this.initSecurity();
    this.checkLoginStatus();
    this.logAppLaunch(options);
  },

  initSecurity() {
    this.globalData.securityManager = new SecurityManager();
    this.globalData.auditLogger = new AuditLogger();
    
    wx.setEnableDebug({
      enableDebug: false
    });
  },

  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    
    if (token && userInfo) {
      try {
        const decryptedToken = DataEncryption.decrypt(token);
        this.globalData.token = decryptedToken;
        this.globalData.userInfo = userInfo;
        this.globalData.role = userInfo.role;
        this.globalData.organizationId = userInfo.organizationId;
      } catch (error) {
        console.error('Token解密失败:', error);
        this.clearLoginStatus();
      }
    }
  },

  clearLoginStatus() {
    this.globalData.token = null;
    this.globalData.userInfo = null;
    this.globalData.role = null;
    this.globalData.organizationId = null;
    
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
  },

  logAppLaunch(options) {
    if (this.globalData.auditLogger) {
      this.globalData.auditLogger.log({
        action: 'APP_LAUNCH',
        module: 'system',
        details: {
          scene: options.scene,
          path: options.path,
          query: options.query
        }
      });
    }
  },

  onShow(options) {
    console.log('小程序显示', options);
    if (this.globalData.auditLogger) {
      this.globalData.auditLogger.log({
        action: 'APP_SHOW',
        module: 'system',
        details: { scene: options.scene }
      });
    }
  },

  onHide() {
    console.log('小程序隐藏');
    if (this.globalData.auditLogger) {
      this.globalData.auditLogger.log({
        action: 'APP_HIDE',
        module: 'system'
      });
    }
  },

  onError(error) {
    console.error('小程序错误:', error);
    if (this.globalData.auditLogger) {
      this.globalData.auditLogger.log({
        action: 'APP_ERROR',
        module: 'system',
        level: 'error',
        details: { error: error.toString() }
      });
    }
  }
});
