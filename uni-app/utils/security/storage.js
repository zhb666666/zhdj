/**
 * 安全存储工具
 * 提供加密存储、数据脱敏、过期管理等功能
 */

const DataEncryption = require('./data-encryption.js')

class SecurityStorage {
  constructor() {
    this.prefix = 'spb_' // Smart Party Building
    this.enableEncryption = true
    this.maxItems = 1000 // 最大存储项数
    this.cleanupThreshold = 800 // 清理阈值
  }

  /**
   * 初始化
   */
  init() {
    console.log('安全存储模块初始化完成')
    
    // 定期清理过期数据
    this.scheduleCleanup()
    
    return true
  }

  /**
   * 存储数据
   */
  set(key, value, options = {}) {
    try {
      const storageKey = this.prefix + key
      const data = {
        value,
        timestamp: Date.now(),
        expireTime: options.expireTime || null,
        encrypted: false
      }

      // 数据加密
      if (this.enableEncryption && options.encrypt !== false) {
        const encryptedData = DataEncryption.encrypt(value)
        data.value = encryptedData
        data.encrypted = true
      }

      // 添加元数据
      data.meta = {
        version: '1.0.0',
        type: typeof value,
        size: JSON.stringify(value).length
      }

      // 存储数据
      const dataStr = JSON.stringify(data)
      uni.setStorageSync(storageKey, dataStr)

      // 检查存储数量，必要时清理
      this.checkStorageLimit()

      return true
    } catch (error) {
      console.error('安全存储失败:', error)
      return false
    }
  }

  /**
   * 获取数据
   */
  get(key, defaultValue = null) {
    try {
      const storageKey = this.prefix + key
      const dataStr = uni.getStorageSync(storageKey)
      
      if (!dataStr) {
        return defaultValue
      }

      const data = JSON.parse(dataStr)

      // 检查是否过期
      if (data.expireTime && Date.now() > data.expireTime) {
        this.remove(key)
        return defaultValue
      }

      // 数据解密
      let value = data.value
      if (data.encrypted && this.enableEncryption) {
        value = DataEncryption.decrypt(data.value)
      }

      return value
    } catch (error) {
      console.error('安全存储读取失败:', error)
      return defaultValue
    }
  }

  /**
   * 删除数据
   */
  remove(key) {
    try {
      const storageKey = this.prefix + key
      uni.removeStorageSync(storageKey)
      return true
    } catch (error) {
      console.error('安全存储删除失败:', error)
      return false
    }
  }

  /**
   * 清空所有数据
   */
  clear() {
    try {
      const keys = uni.getStorageInfoSync().keys
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          uni.removeStorageSync(key)
        }
      })
      return true
    } catch (error) {
      console.error('安全存储清空失败:', error)
      return false
    }
  }

  /**
   * 检查存储限制
   */
  checkStorageLimit() {
    try {
      const storageInfo = uni.getStorageInfoSync()
      const currentKeys = storageInfo.keys.filter(key => key.startsWith(this.prefix))
      
      if (currentKeys.length > this.maxItems) {
        console.warn('安全存储项数超过限制，开始清理')
        this.cleanup()
      }
    } catch (error) {
      console.error('检查存储限制失败:', error)
    }
  }

  /**
   * 清理过期和无用数据
   */
  cleanup() {
    try {
      const storageInfo = uni.getStorageInfoSync()
      const currentKeys = storageInfo.keys.filter(key => key.startsWith(this.prefix))
      const expiredKeys = []
      const oldKeys = []
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)

      // 分析存储项
      currentKeys.forEach(key => {
        try {
          const dataStr = uni.getStorageSync(key)
          const data = JSON.parse(dataStr)

          // 检查过期
          if (data.expireTime && Date.now() > data.expireTime) {
            expiredKeys.push(key)
            return
          }

          // 检查老旧数据（非加密的临时数据）
          if (!data.encrypted && data.timestamp < sevenDaysAgo) {
            oldKeys.push(key)
          }
        } catch (error) {
          // 数据损坏，标记为删除
          expiredKeys.push(key)
        }
      })

      // 删除过期和损坏的数据
      let deleteCount = 0
      expiredKeys.concat(oldKeys).forEach(key => {
        uni.removeStorageSync(key)
        deleteCount++
      })

      // 如果还是没有足够空间，删除最旧的数据
      if (deleteCount < 50) {
        const remainingKeys = storageInfo.keys.filter(key => 
          key.startsWith(this.prefix)
        ).slice(0, this.maxItems - 100)
        
        remainingKeys.forEach(key => {
          uni.removeStorageSync(key)
        })
      }

      console.log(`安全存储清理完成，删除了 ${deleteCount} 项数据`)
    } catch (error) {
      console.error('安全存储清理失败:', error)
    }
  }

  /**
   * 定期清理
   */
  scheduleCleanup() {
    // 每天清理一次
    setInterval(() => {
      this.cleanup()
    }, 24 * 60 * 60 * 1000)

    // 应用启动时也清理一次
    setTimeout(() => {
      this.cleanup()
    }, 5000)
  }

  /**
   * 存储用户认证信息
   */
  setAuth(authData) {
    const expireTime = Date.now() + (24 * 60 * 60 * 1000) // 24小时过期
    return this.set('auth_data', authData, { 
      expireTime,
      encrypt: true 
    })
  }

  /**
   * 获取用户认证信息
   */
  getAuth() {
    return this.get('auth_data')
  }

  /**
   * 清除用户认证信息
   */
  clearAuth() {
    return this.remove('auth_data')
  }

  /**
   * 存储敏感用户数据
   */
  setSensitiveUserData(data) {
    const expireTime = Date.now() + (12 * 60 * 60 * 1000) // 12小时过期
    return this.set('sensitive_user_data', data, { 
      expireTime,
      encrypt: true 
    })
  }

  /**
   * 获取敏感用户数据
   */
  getSensitiveUserData() {
    return this.get('sensitive_user_data')
  }

  /**
   * 存储审计日志
   */
  setAuditLog(logData) {
    const logs = this.get('audit_logs', [])
    logs.unshift({
      ...logData,
      timestamp: Date.now(),
      deviceInfo: this.getDeviceInfo()
    })

    // 只保留最近1000条日志
    if (logs.length > 1000) {
      logs.splice(1000)
    }

    return this.set('audit_logs', logs, { encrypt: true })
  }

  /**
   * 获取审计日志
   */
  getAuditLogs(limit = 100) {
    const logs = this.get('audit_logs', [])
    return logs.slice(0, limit)
  }

  /**
   * 存储配置信息
   */
  setConfig(configKey, configValue) {
    const configs = this.get('configs', {})
    configs[configKey] = {
      value: configValue,
      timestamp: Date.now()
    }
    return this.set('configs', configs, { encrypt: false })
  }

  /**
   * 获取配置信息
   */
  getConfig(configKey, defaultValue = null) {
    const configs = this.get('configs', {})
    return configs[configKey]?.value || defaultValue
  }

  /**
   * 获取存储信息
   */
  getStorageInfo() {
    try {
      const info = uni.getStorageInfoSync()
      const secureKeys = info.keys.filter(key => key.startsWith(this.prefix))
      
      return {
        ...info,
        secureKeys,
        secureKeysCount: secureKeys.length
      }
    } catch (error) {
      console.error('获取存储信息失败:', error)
      return null
    }
  }

  /**
   * 获取设备信息
   */
  getDeviceInfo() {
    try {
      const systemInfo = uni.getSystemInfoSync()
      return {
        platform: systemInfo.platform,
        model: systemInfo.model,
        system: systemInfo.system,
        version: systemInfo.version,
        SDKVersion: systemInfo.SDKVersion,
        brand: systemInfo.brand,
        manufacturer: systemInfo.manufacturer
      }
    } catch (error) {
      return {}
    }
  }

  /**
   * 数据备份
   */
  backup() {
    try {
      const storageInfo = this.getStorageInfo()
      const backupData = {}

      storageInfo.secureKeys.forEach(key => {
        try {
          const dataStr = uni.getStorageSync(key)
          backupData[key] = dataStr
        } catch (error) {
          console.warn(`备份数据失败: ${key}`)
        }
      })

      const backup = {
        version: '1.0.0',
        timestamp: Date.now(),
        data: backupData,
        deviceInfo: this.getDeviceInfo()
      }

      this.set('backup_data', backup, { expireTime: Date.now() + (7 * 24 * 60 * 60 * 1000) })
      
      return backup
    } catch (error) {
      console.error('数据备份失败:', error)
      return null
    }
  }

  /**
   * 数据恢复
   */
  restore(backupData) {
    try {
      if (!backupData || !backupData.data) {
        throw new Error('备份数据无效')
      }

      // 清空现有数据
      this.clear()

      // 恢复数据
      Object.entries(backupData.data).forEach(([key, value]) => {
        try {
          uni.setStorageSync(key, value)
        } catch (error) {
          console.warn(`恢复数据失败: ${key}`)
        }
      })

      console.log('数据恢复完成')
      return true
    } catch (error) {
      console.error('数据恢复失败:', error)
      return false
    }
  }

  /**
   * 导出数据（脱敏）
   */
  exportData() {
    try {
      const storageInfo = this.getStorageInfo()
      const exportData = {
        version: '1.0.0',
        timestamp: Date.now(),
        items: []
      }

      storageInfo.secureKeys.forEach(key => {
        try {
          const dataStr = uni.getStorageSync(key)
          const data = JSON.parse(dataStr)
          
          // 脱敏处理
          const sanitizedData = this.sanitizeForExport(data)
          
          exportData.items.push({
            key: key.replace(this.prefix, ''),
            ...sanitizedData
          })
        } catch (error) {
          console.warn(`导出数据失败: ${key}`)
        }
      })

      return exportData
    } catch (error) {
      console.error('数据导出失败:', error)
      return null
    }
  }

  /**
   * 导出数据脱敏处理
   */
  sanitizeForExport(data) {
    if (!data || !data.value) return data

    let sanitizedValue = data.value

    // 如果是加密数据，不导出具体内容
    if (data.encrypted) {
      sanitizedValue = '[ENCRYPTED_DATA]'
    } else {
      // 脱敏处理敏感字段
      if (typeof sanitizedValue === 'object') {
        const sensitiveFields = ['idCard', 'phone', 'email', 'password', 'token']
        sanitizedValue = JSON.parse(JSON.stringify(sanitizedValue))
        
        sensitiveFields.forEach(field => {
          if (sanitizedValue[field]) {
            sanitizedValue[field] = '[SENSITIVE_DATA]'
          }
        })
      }
    }

    return {
      ...data,
      value: sanitizedValue
    }
  }
}

// 创建单例
const securityStorage = new SecurityStorage()

// 导出
module.exports = securityStorage
module.exports.default = securityStorage
