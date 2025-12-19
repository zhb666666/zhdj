import ApiService from './api.service';
import { DataEncryption } from '../utils/security/data-encryption';

export class AuthService {
  static async login(username, password) {
    try {
      const encryptedPassword = DataEncryption.hashData(password);
      
      const result = await ApiService.post('/auth/login', {
        username,
        password: encryptedPassword
      }, { requireAuth: false });

      if (result.success) {
        const { token, userInfo } = result.data;
        
        const app = getApp();
        const encryptedToken = DataEncryption.encrypt(token);
        
        wx.setStorageSync('token', encryptedToken);
        wx.setStorageSync('userInfo', userInfo);
        
        app.globalData.token = token;
        app.globalData.userInfo = userInfo;
        app.globalData.role = userInfo.role;
        app.globalData.organizationId = userInfo.organizationId;

        if (app.globalData.auditLogger) {
          app.globalData.auditLogger.logLogin(
            userInfo.id,
            userInfo.name,
            true
          );
        }
      }

      return result;

    } catch (error) {
      console.error('登录失败:', error);
      
      const app = getApp();
      if (app.globalData.auditLogger) {
        app.globalData.auditLogger.logLogin(
          username,
          username,
          false,
          error.message
        );
      }

      return {
        success: false,
        error: error.message || '登录失败'
      };
    }
  }

  static async wxLogin(code) {
    try {
      const result = await ApiService.post('/auth/wx-login', {
        code
      }, { requireAuth: false });

      if (result.success) {
        const { token, userInfo, isNewUser } = result.data;
        
        const app = getApp();
        const encryptedToken = DataEncryption.encrypt(token);
        
        wx.setStorageSync('token', encryptedToken);
        wx.setStorageSync('userInfo', userInfo);
        
        app.globalData.token = token;
        app.globalData.userInfo = userInfo;
        app.globalData.role = userInfo.role;
        app.globalData.organizationId = userInfo.organizationId;

        if (app.globalData.auditLogger) {
          app.globalData.auditLogger.logLogin(
            userInfo.id,
            userInfo.name,
            true
          );
        }

        return { ...result, isNewUser };
      }

      return result;

    } catch (error) {
      console.error('微信登录失败:', error);
      return {
        success: false,
        error: error.message || '登录失败'
      };
    }
  }

  static async logout() {
    try {
      const app = getApp();
      const userInfo = app.globalData.userInfo;

      await ApiService.post('/auth/logout');

      if (app.globalData.auditLogger) {
        app.globalData.auditLogger.logLogout(
          userInfo?.id,
          userInfo?.name
        );
      }

      app.clearLoginStatus();

      wx.reLaunch({
        url: '/pages/login/login'
      });

      return { success: true };

    } catch (error) {
      console.error('退出登录失败:', error);
      return {
        success: false,
        error: error.message || '退出失败'
      };
    }
  }

  static async refreshToken() {
    try {
      const result = await ApiService.post('/auth/refresh-token');

      if (result.success) {
        const { token } = result.data;
        
        const app = getApp();
        const encryptedToken = DataEncryption.encrypt(token);
        
        wx.setStorageSync('token', encryptedToken);
        app.globalData.token = token;
      }

      return result;

    } catch (error) {
      console.error('刷新Token失败:', error);
      return {
        success: false,
        error: error.message || '刷新失败'
      };
    }
  }

  static async getUserInfo() {
    try {
      const result = await ApiService.get('/auth/user-info');

      if (result.success) {
        const app = getApp();
        const userInfo = result.data;
        
        wx.setStorageSync('userInfo', userInfo);
        app.globalData.userInfo = userInfo;
        app.globalData.role = userInfo.role;
        app.globalData.organizationId = userInfo.organizationId;
      }

      return result;

    } catch (error) {
      console.error('获取用户信息失败:', error);
      return {
        success: false,
        error: error.message || '获取失败'
      };
    }
  }

  static async updatePassword(oldPassword, newPassword) {
    try {
      const app = getApp();
      const encryptedOldPassword = DataEncryption.hashData(oldPassword);
      const encryptedNewPassword = DataEncryption.hashData(newPassword);

      const result = await ApiService.post('/auth/update-password', {
        oldPassword: encryptedOldPassword,
        newPassword: encryptedNewPassword
      });

      if (result.success && app.globalData.auditLogger) {
        app.globalData.auditLogger.log({
          action: 'PASSWORD_CHANGED',
          module: 'authentication',
          level: 'info'
        });
      }

      return result;

    } catch (error) {
      console.error('修改密码失败:', error);
      return {
        success: false,
        error: error.message || '修改失败'
      };
    }
  }

  static async requestDataConsent(dataTypes = []) {
    try {
      const app = getApp();
      const userId = app.globalData.userInfo?.id;

      if (!userId) {
        throw new Error('用户未登录');
      }

      return new Promise((resolve) => {
        wx.showModal({
          title: '数据使用授权',
          content: `根据《个人信息保护法》等相关法律法规，我们需要您授权使用以下数据：\n\n${dataTypes.join('\n')}\n\n我们承诺严格保护您的数据安全和隐私。`,
          confirmText: '同意',
          cancelText: '拒绝',
          success: (res) => {
            if (res.confirm) {
              dataTypes.forEach(dataType => {
                app.globalData.securityManager.recordDataConsent(
                  userId,
                  dataType,
                  true
                );
              });
              
              resolve({ success: true, consented: true });
            } else {
              resolve({ success: true, consented: false });
            }
          }
        });
      });

    } catch (error) {
      console.error('请求数据授权失败:', error);
      return {
        success: false,
        error: error.message || '授权失败'
      };
    }
  }
}

export default AuthService;
