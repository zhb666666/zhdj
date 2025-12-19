import { SecurityConfig } from '../../config/security.config';
import { DataEncryption } from './data-encryption';

export class AuditLogger {
  constructor() {
    this.logs = [];
    this.loadLogs();
    this.startSyncTimer();
  }

  loadLogs() {
    try {
      const storedLogs = wx.getStorageSync(SecurityConfig.audit.localStorageKey);
      if (storedLogs) {
        this.logs = JSON.parse(storedLogs);
      }
    } catch (error) {
      console.error('加载审计日志失败:', error);
      this.logs = [];
    }
  }

  saveLogs() {
    try {
      const logsToKeep = this.logs.slice(-SecurityConfig.audit.maxLocalLogs);
      wx.setStorageSync(SecurityConfig.audit.localStorageKey, JSON.stringify(logsToKeep));
      this.logs = logsToKeep;
    } catch (error) {
      console.error('保存审计日志失败:', error);
    }
  }

  log(logEntry) {
    if (!SecurityConfig.audit.enabled) return;

    const app = getApp();
    const userInfo = app.globalData.userInfo;

    const entry = {
      id: this.generateLogId(),
      timestamp: new Date().toISOString(),
      userId: userInfo?.id || 'anonymous',
      userName: userInfo?.name || '匿名用户',
      organizationId: userInfo?.organizationId || null,
      role: userInfo?.role || 'guest',
      action: logEntry.action,
      module: logEntry.module,
      level: logEntry.level || 'info',
      details: logEntry.details || {},
      deviceInfo: this.getDeviceInfo(),
      ipAddress: null,
      success: logEntry.success !== undefined ? logEntry.success : true
    };

    this.logs.push(entry);

    if (this.shouldLogToConsole(entry)) {
      console.log(`[审计日志] ${entry.action}:`, entry);
    }

    if (this.logs.length >= SecurityConfig.audit.maxLocalLogs) {
      this.saveLogs();
      this.syncToServer();
    }

    return entry;
  }

  generateLogId() {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  getDeviceInfo() {
    try {
      const systemInfo = wx.getSystemInfoSync();
      return {
        model: systemInfo.model,
        system: systemInfo.system,
        platform: systemInfo.platform,
        version: systemInfo.version,
        SDKVersion: systemInfo.SDKVersion
      };
    } catch (error) {
      console.error('获取设备信息失败:', error);
      return {};
    }
  }

  shouldLogToConsole(entry) {
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(SecurityConfig.audit.logLevel);
    const entryLevelIndex = levels.indexOf(entry.level);
    
    return entryLevelIndex >= currentLevelIndex;
  }

  startSyncTimer() {
    if (!SecurityConfig.audit.enabled) return;

    setInterval(() => {
      this.syncToServer();
    }, SecurityConfig.audit.syncInterval);
  }

  async syncToServer() {
    if (this.logs.length === 0) return;

    const logsToSync = [...this.logs];
    
    try {
      console.log(`同步 ${logsToSync.length} 条审计日志到服务器...`);
      
      this.logs = [];
      this.saveLogs();
      
      return true;
    } catch (error) {
      console.error('同步审计日志失败:', error);
      this.logs = logsToSync.concat(this.logs);
      return false;
    }
  }

  logLogin(userId, userName, success = true, reason = null) {
    return this.log({
      action: 'LOGIN',
      module: 'authentication',
      level: success ? 'info' : 'warn',
      success,
      details: {
        userId,
        userName,
        reason: reason || (success ? '登录成功' : '登录失败')
      }
    });
  }

  logLogout(userId, userName) {
    return this.log({
      action: 'LOGOUT',
      module: 'authentication',
      level: 'info',
      details: {
        userId,
        userName
      }
    });
  }

  logDataAccess(resource, operation, recordId = null) {
    return this.log({
      action: 'DATA_ACCESS',
      module: 'data',
      level: 'info',
      details: {
        resource,
        operation,
        recordId
      }
    });
  }

  logDataModification(resource, operation, recordId, changes = {}) {
    return this.log({
      action: 'DATA_MODIFICATION',
      module: 'data',
      level: 'warn',
      details: {
        resource,
        operation,
        recordId,
        changes: this.sanitizeChanges(changes)
      }
    });
  }

  logDataExport(resource, recordCount, format) {
    return this.log({
      action: 'DATA_EXPORT',
      module: 'data',
      level: 'warn',
      details: {
        resource,
        recordCount,
        format
      }
    });
  }

  logPermissionDenied(resource, operation, reason) {
    return this.log({
      action: 'PERMISSION_DENIED',
      module: 'security',
      level: 'warn',
      success: false,
      details: {
        resource,
        operation,
        reason
      }
    });
  }

  logSecurityEvent(eventType, severity, details) {
    return this.log({
      action: 'SECURITY_EVENT',
      module: 'security',
      level: severity,
      details: {
        eventType,
        ...details
      }
    });
  }

  sanitizeChanges(changes) {
    const sanitized = { ...changes };
    
    SecurityConfig.dataProtection.sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '***已隐藏***';
      }
    });
    
    return sanitized;
  }

  getLogs(filters = {}) {
    let filteredLogs = [...this.logs];

    if (filters.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filters.userId);
    }

    if (filters.action) {
      filteredLogs = filteredLogs.filter(log => log.action === filters.action);
    }

    if (filters.module) {
      filteredLogs = filteredLogs.filter(log => log.module === filters.module);
    }

    if (filters.level) {
      filteredLogs = filteredLogs.filter(log => log.level === filters.level);
    }

    if (filters.startDate) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filteredLogs = filteredLogs.filter(log => 
        new Date(log.timestamp) <= new Date(filters.endDate)
      );
    }

    return filteredLogs;
  }

  clearOldLogs(daysToKeep = SecurityConfig.audit.retention) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    this.logs = this.logs.filter(log => 
      new Date(log.timestamp) >= cutoffDate
    );

    this.saveLogs();
  }

  exportLogs(format = 'json') {
    const logsData = this.logs;

    if (format === 'json') {
      return JSON.stringify(logsData, null, 2);
    } else if (format === 'csv') {
      return this.convertToCSV(logsData);
    }

    return logsData;
  }

  convertToCSV(logs) {
    if (logs.length === 0) return '';

    const headers = ['时间', '用户ID', '用户名', '角色', '操作', '模块', '级别', '成功', '详情'];
    const rows = logs.map(log => [
      log.timestamp,
      log.userId,
      log.userName,
      log.role,
      log.action,
      log.module,
      log.level,
      log.success ? '是' : '否',
      JSON.stringify(log.details)
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  }
}

export default AuditLogger;
