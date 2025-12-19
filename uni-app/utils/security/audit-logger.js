/**
 * 审计日志工具
 * 记录用户操作、系统事件、安全事件等
 */

const SecurityStorage = require('./storage.js')
const Request = require('../api/request.js')

class AuditLogger {
  constructor() {
    this.enableLogging = true
    this.maxLocalLogs = 1000
    this.syncInterval = 5 * 60 * 1000 // 5分钟同步一次
    this.pendingLogs = []
    this.isSyncing = false
  }

  /**
   * 初始化
   */
  init() {
    console.log('审计日志模块初始化完成')
    
    // 定期同步日志到服务器
    this.scheduleSync()
    
    return true
  }

  /**
   * 记录日志
   */
  async log(action, data = {}, userInfo = null) {
    if (!this.enableLogging) return

    try {
      const logEntry = {
        id: this.generateLogId(),
        action,
        data: this.sanitizeData(data),
        user: userInfo || this.getCurrentUserInfo(),
        timestamp: Date.now(),
        deviceInfo: SecurityStorage.getDeviceInfo(),
        sessionId: this.getSessionId(),
        ip: this.getClientIP(),
        userAgent: this.getUserAgent(),
        level: this.getLogLevel(action),
        category: this.getLogCategory(action)
      }

      // 添加本地日志
      this.addLocalLog(logEntry)

      // 如果有网络连接，同步到服务器
      if (this.isNetworkAvailable()) {
        await this.syncToServer(logEntry)
      } else {
        this.pendingLogs.push(logEntry)
      }

      // 记录重要日志到控制台
      if (logEntry.level === 'ERROR' || logEntry.level === 'WARN') {
        console.warn(`审计日志 [${logEntry.level}]: ${action}`, logEntry)
      }

    } catch (error) {
      console.error('记录审计日志失败:', error)
    }
  }

  /**
   * 记录登录事件
   */
  async logLogin(username, success, userInfo = null, error = null) {
    await this.log('LOGIN', {
      username,
      success,
      userInfo,
      error: error ? error.message : null,
      attemptTime: Date.now()
    }, userInfo)
  }

  /**
   * 记录登出事件
   */
  async logLogout(userInfo) {
    await this.log('LOGOUT', {
      userId: userInfo?.id,
      logoutTime: Date.now()
    }, userInfo)
  }

  /**
   * 记录数据访问事件
   */
  async logDataAccess(resource, operation, resourceId = null, userInfo = null) {
    await this.log('DATA_ACCESS', {
      resource,
      operation,
      resourceId,
      accessTime: Date.now()
    }, userInfo)
  }

  /**
   * 记录数据修改事件
   */
  async logDataModification(resource, operation, resourceId, oldData, newData, userInfo = null) {
    await this.log('DATA_MODIFICATION', {
      resource,
      operation,
      resourceId,
      oldData: this.sanitizeData(oldData),
      newData: this.sanitizeData(newData),
      modificationTime: Date.now()
    }, userInfo)
  }

  /**
   * 记录权限验证事件
   */
  async logPermissionCheck(permission, granted, userInfo = null) {
    await this.log('PERMISSION_CHECK', {
      permission,
      granted,
      checkTime: Date.now()
    }, userInfo)
  }

  /**
   * 记录安全事件
   */
  async logSecurityEvent(eventType, details = {}, userInfo = null) {
    await this.log('SECURITY_EVENT', {
      eventType,
      details,
      eventTime: Date.now()
    }, userInfo)
  }

  /**
   * 记录系统错误
   */
  async logSystemError(error, context = {}) {
    await this.log('SYSTEM_ERROR', {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      context,
      errorTime: Date.now()
    })
  }

  /**
   * 记录API调用
   */
  async logApiCall(apiPath, method, success, responseTime, userInfo = null) {
    await this.log('API_CALL', {
      apiPath,
      method,
      success,
      responseTime,
      callTime: Date.now()
    }, userInfo)
  }

  /**
   * 添加本地日志
   */
  addLocalLog(logEntry) {
    try {
      const logs = SecurityStorage.get('audit_logs', [])
      logs.unshift(logEntry)

      // 保持本地日志数量限制
      if (logs.length > this.maxLocalLogs) {
        logs.splice(this.maxLocalLogs)
      }

      SecurityStorage.set('audit_logs', logs, { encrypt: true })
    } catch (error) {
      console.error('保存本地审计日志失败:', error)
    }
  }

  /**
   * 同步到服务器
   */
  async syncToServer(logEntry) {
    try {
      if (this.isSyncing) return

      this.isSyncing = true

      const Request = require('../api/request.js')
      const response = await Request.post('/api/audit/log', {
        logs: [logEntry]
      })

      if (response.success) {
        console.log('审计日志同步成功')
      } else {
        console.warn('审计日志同步失败:', response.message)
        // 同步失败，重新加入待同步队列
        this.pendingLogs.push(logEntry)
      }
    } catch (error) {
      console.warn('审计日志同步出错:', error)
      this.pendingLogs.push(logEntry)
    } finally {
      this.isSyncing = false
    }
  }

  /**
   * 批量同步日志
   */
  async syncPendingLogs() {
    if (this.pendingLogs.length === 0 || this.isSyncing) return

    try {
      this.isSyncing = true

      const Request = require('../api/request.js')
      const logsToSync = [...this.pendingLogs]
      this.pendingLogs = []

      const response = await Request.post('/api/audit/logs/batch', {
        logs: logsToSync
      })

      if (response.success) {
        console.log(`批量同步 ${logsToSync.length} 条审计日志成功`)
      } else {
        console.warn('批量同步审计日志失败:', response.message)
        // 同步失败，重新加入待同步队列
        this.pendingLogs.unshift(...logsToSync)
      }
    } catch (error) {
      console.warn('批量同步审计日志出错:', error)
      this.pendingLogs.unshift(...logsToSync)
    } finally {
      this.isSyncing = false
    }
  }

  /**
   * 定期同步
   */
  scheduleSync() {
    // 定时同步
    setInterval(() => {
      this.syncPendingLogs()
    }, this.syncInterval)

    // 应用启动时延迟同步
    setTimeout(() => {
      this.syncPendingLogs()
    }, 10000)

    // 页面显示时尝试同步
    const originalOnShow = Page.prototype.onShow
    Page.prototype.onShow = function() {
      originalOnShow.call(this)
      auditLogger.syncPendingLogs()
    }
  }

  /**
   * 获取本地日志
   */
  getLocalLogs(limit = 100, level = null, category = null) {
    try {
      const logs = SecurityStorage.get('audit_logs', [])
      
      let filteredLogs = logs
      
      // 按级别过滤
      if (level) {
        filteredLogs = filteredLogs.filter(log => log.level === level)
      }
      
      // 按类别过滤
      if (category) {
        filteredLogs = filteredLogs.filter(log => log.category === category)
      }
      
      return filteredLogs.slice(0, limit)
    } catch (error) {
      console.error('获取本地审计日志失败:', error)
      return []
    }
  }

  /**
   * 导出日志
   */
  exportLogs(format = 'json', level = null, category = null, startTime = null, endTime = null) {
    try {
      let logs = this.getLocalLogs(this.maxLocalLogs, level, category)
      
      // 按时间过滤
      if (startTime) {
        logs = logs.filter(log => log.timestamp >= startTime)
      }
      if (endTime) {
        logs = logs.filter(log => log.timestamp <= endTime)
      }

      if (format === 'json') {
        const exportData = {
          version: '1.0.0',
          exportTime: Date.now(),
          totalLogs: logs.length,
          logs: logs
        }
        
        const dataStr = JSON.stringify(exportData, null, 2)
        this.downloadFile(dataStr, `audit_logs_${Date.now()}.json`, 'application/json')
        
      } else if (format === 'csv') {
        const csvHeader = 'ID,Action,User,Level,Category,Timestamp,Device,IP\n'
        const csvData = logs.map(log => [
          log.id,
          log.action,
          log.user?.name || 'Unknown',
          log.level,
          log.category,
          new Date(log.timestamp).toISOString(),
          log.deviceInfo?.model || 'Unknown',
          log.ip || 'Unknown'
        ].map(field => `"${field}"`).join(',')).join('\n')
        
        const csvContent = csvHeader + csvData
        this.downloadFile(csvContent, `audit_logs_${Date.now()}.csv`, 'text/csv')
      }

      console.log(`导出 ${logs.length} 条审计日志`)
      return true
    } catch (error) {
      console.error('导出审计日志失败:', error)
      return false
    }
  }

  /**
   * 下载文件
   */
  downloadFile(content, filename) {
    // 保存到临时文件（实际使用时可能需要不同的实现）
    const fs = uni.getFileSystemManager()
    const filePath = `${uni.env.USER_DATA_PATH}/${filename}`
    
    fs.writeFile({
      filePath,
      data: content,
      success: () => {
        uni.showToast({
          title: '日志导出成功',
          icon: 'success'
        })
      },
      fail: () => {
        uni.showToast({
          title: '导出失败',
          icon: 'none'
        })
      }
    })
  }

  /**
   * 清理旧日志
   */
  async cleanupLogs(olderThanDays = 30) {
    try {
      const cutoffTime = Date.now() - (olderThanDays * 24 * 60 * 60 * 1000)
      const logs = SecurityStorage.get('audit_logs', [])
      const filteredLogs = logs.filter(log => log.timestamp >= cutoffTime)
      
      SecurityStorage.set('audit_logs', filteredLogs, { encrypt: true })
      
      const deletedCount = logs.length - filteredLogs.length
      console.log(`清理了 ${deletedCount} 条过期审计日志`)
      
      return deletedCount
    } catch (error) {
      console.error('清理审计日志失败:', error)
      return 0
    }
  }

  /**
   * 获取日志统计
   */
  getLogStats(days = 7) {
    try {
      const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000)
      const logs = SecurityStorage.get('audit_logs', [])
      const recentLogs = logs.filter(log => log.timestamp >= cutoffTime)
      
      const stats = {
        total: recentLogs.length,
        byLevel: {},
        byCategory: {},
        byAction: {},
        dailyCount: {}
      }
      
      recentLogs.forEach(log => {
        // 按级别统计
        stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1
        
        // 按类别统计
        stats.byCategory[log.category] = (stats.byCategory[log.category] || 0) + 1
        
        // 按动作统计
        stats.byAction[log.action] = (stats.byAction[log.action] || 0) + 1
        
        // 按天统计
        const date = new Date(log.timestamp).toISOString().split('T')[0]
        stats.dailyCount[date] = (stats.dailyCount[date] || 0) + 1
      })
      
      return stats
    } catch (error) {
      console.error('获取日志统计失败:', error)
      return null
    }
  }

  /**
   * 工具方法
   */
  generateLogId() {
    return 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  getCurrentUserInfo() {
    try {
      const userInfo = uni.getStorageSync('user_info')
      return userInfo ? JSON.parse(userInfo) : null
    } catch (e) {
      return null
    }
  }

  getSessionId() {
    let sessionId = SecurityStorage.get('session_id')
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      SecurityStorage.set('session_id', sessionId)
    }
    return sessionId
  }

  getClientIP() {
    // 在uni-app中，无法直接获取客户端IP，返回模拟值
    return '127.0.0.1'
  }

  getUserAgent() {
    const systemInfo = uni.getSystemInfoSync()
    return `${systemInfo.platform} ${systemInfo.model}`
  }

  sanitizeData(data) {
    if (!data || typeof data !== 'object') return data
    
    // 脱敏敏感字段
    const sensitiveFields = ['password', 'token', 'idCard', 'phone', 'email']
    const sanitizedData = JSON.parse(JSON.stringify(data))
    
    sensitiveFields.forEach(field => {
      if (sanitizedData[field]) {
        sanitizedData[field] = '[SENSITIVE_DATA]'
      }
    })
    
    return sanitizedData
  }

  getLogLevel(action) {
    const criticalActions = ['SECURITY_EVENT', 'SYSTEM_ERROR', 'LOGIN_FAILURE']
    const warningActions = ['PERMISSION_DENIED', 'DATA_MODIFICATION']
    
    if (criticalActions.includes(action)) return 'ERROR'
    if (warningActions.includes(action)) return 'WARN'
    return 'INFO'
  }

  getLogCategory(action) {
    const categoryMap = {
      'LOGIN': 'AUTH',
      'LOGOUT': 'AUTH',
      'DATA_ACCESS': 'DATA',
      'DATA_MODIFICATION': 'DATA',
      'PERMISSION_CHECK': 'SECURITY',
      'SECURITY_EVENT': 'SECURITY',
      'SYSTEM_ERROR': 'SYSTEM',
      'API_CALL': 'SYSTEM'
    }
    
    return categoryMap[action] || 'GENERAL'
  }

  isNetworkAvailable() {
    // 简单的网络检查
    return true // 在实际应用中可能需要更复杂的检查
  }

  /**
   * 设置日志级别
   */
  setLogLevel(level) {
    this.enableLogging = level !== 'OFF'
  }

  /**
   * 启用/禁用审计日志
   */
  enable() {
    this.enableLogging = true
  }

  /**
   * 禁用审计日志
   */
  disable() {
    this.enableLogging = false
  }
}

// 创建单例
const auditLogger = new AuditLogger()

// 导出
module.exports = auditLogger
module.exports.default = auditLogger
