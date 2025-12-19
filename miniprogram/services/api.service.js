import { SecurityManager } from '../utils/security/security-manager';
import { DataEncryption } from '../utils/security/data-encryption';

const BASE_URL = 'https://api.example.com';

export class ApiService {
  static securityManager = new SecurityManager();

  static async request(endpoint, options = {}) {
    const {
      method = 'GET',
      data = null,
      requireAuth = true,
      showLoading = true
    } = options;

    if (showLoading) {
      wx.showLoading({ title: '加载中...' });
    }

    try {
      const app = getApp();
      const url = `${BASE_URL}${endpoint}`;

      if (requireAuth && !app.globalData.token) {
        throw new Error('请先登录');
      }

      const requestConfig = requireAuth
        ? this.securityManager.generateSecureRequest(url, data, method)
        : { url, method, data };

      const response = await new Promise((resolve, reject) => {
        wx.request({
          ...requestConfig,
          success: resolve,
          fail: reject
        });
      });

      const validatedData = this.securityManager.validateResponse(response);

      if (app.globalData.auditLogger) {
        app.globalData.auditLogger.logDataAccess(
          endpoint,
          method,
          response.data?.id
        );
      }

      return {
        success: true,
        data: validatedData
      };

    } catch (error) {
      console.error('API请求失败:', error);
      
      const app = getApp();
      if (app.globalData.auditLogger) {
        app.globalData.auditLogger.log({
          action: 'API_REQUEST_FAILED',
          module: 'api',
          level: 'error',
          success: false,
          details: {
            endpoint,
            method,
            error: error.message
          }
        });
      }

      return {
        success: false,
        error: error.message || '请求失败'
      };

    } finally {
      if (showLoading) {
        wx.hideLoading();
      }
    }
  }

  static async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  static async post(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', data });
  }

  static async put(endpoint, data, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', data });
  }

  static async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  static async uploadFile(filePath, endpoint, formData = {}) {
    wx.showLoading({ title: '上传中...' });

    try {
      const app = getApp();
      const url = `${BASE_URL}${endpoint}`;

      const response = await new Promise((resolve, reject) => {
        wx.uploadFile({
          url,
          filePath,
          name: 'file',
          formData,
          header: {
            'Authorization': `Bearer ${app.globalData.token}`
          },
          success: resolve,
          fail: reject
        });
      });

      const data = JSON.parse(response.data);

      if (app.globalData.auditLogger) {
        app.globalData.auditLogger.log({
          action: 'FILE_UPLOAD',
          module: 'api',
          level: 'info',
          details: {
            endpoint,
            fileName: filePath.split('/').pop()
          }
        });
      }

      return {
        success: true,
        data
      };

    } catch (error) {
      console.error('文件上传失败:', error);
      return {
        success: false,
        error: error.message || '上传失败'
      };

    } finally {
      wx.hideLoading();
    }
  }

  static async downloadFile(url, fileName) {
    wx.showLoading({ title: '下载中...' });

    try {
      const app = getApp();

      const response = await new Promise((resolve, reject) => {
        wx.downloadFile({
          url,
          header: {
            'Authorization': `Bearer ${app.globalData.token}`
          },
          success: resolve,
          fail: reject
        });
      });

      if (response.statusCode === 200) {
        await wx.saveFile({
          tempFilePath: response.tempFilePath
        });

        if (app.globalData.auditLogger) {
          app.globalData.auditLogger.log({
            action: 'FILE_DOWNLOAD',
            module: 'api',
            level: 'info',
            details: { url, fileName }
          });
        }

        return {
          success: true,
          filePath: response.tempFilePath
        };
      }

      throw new Error('下载失败');

    } catch (error) {
      console.error('文件下载失败:', error);
      return {
        success: false,
        error: error.message || '下载失败'
      };

    } finally {
      wx.hideLoading();
    }
  }
}

export default ApiService;
