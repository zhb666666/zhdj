/**
 * 数据加密工具
 * 使用XOR+Base64对敏感数据进行加密保护
 */

class DataEncryption {
  constructor() {
    this.defaultKey = 'smart_party_building_key_2024'
    this.enabled = true
  }

  /**
   * 初始化
   */
  init() {
    console.log('数据加密模块初始化完成')
    return true
  }

  /**
   * 获取加密密钥
   */
  getKey() {
    // 从安全存储中获取密钥，如果不存在则使用默认密钥
    let key = uni.getStorageSync('encryption_key')
    if (!key) {
      key = this.generateKey()
      this.storeKey(key)
    }
    return key
  }

  /**
   * 生成密钥
   */
  generateKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  /**
   * 存储密钥
   */
  storeKey(key) {
    const SecurityStorage = require('./storage.js')
    SecurityStorage.set('encryption_key', key)
  }

  /**
   * 加密数据
   */
  encrypt(data, key = null) {
    if (!this.enabled) return data
    
    try {
      const encryptKey = key || this.getKey()
      const dataStr = typeof data === 'string' ? data : JSON.stringify(data)
      
      // XOR加密
      const encrypted = this.xorEncrypt(dataStr, encryptKey)
      
      // Base64编码
      const encoded = this.base64Encode(encrypted)
      
      return {
        encrypted: true,
        content: encoded,
        algorithm: 'XOR+Base64'
      }
    } catch (error) {
      console.error('数据加密失败:', error)
      return data
    }
  }

  /**
   * 解密数据
   */
  decrypt(encryptedData, key = null) {
    if (!this.enabled) return encryptedData
    
    try {
      if (typeof encryptedData === 'object' && encryptedData.encrypted) {
        const encryptKey = key || this.getKey()
        const decoded = this.base64Decode(encryptedData.content)
        const decrypted = this.xorDecrypt(decoded, encryptKey)
        return decrypted
      }
      return encryptedData
    } catch (error) {
      console.error('数据解密失败:', error)
      return encryptedData
    }
  }

  /**
   * XOR加密
   */
  xorEncrypt(data, key) {
    let result = ''
    for (let i = 0; i < data.length; i++) {
      const dataChar = data.charCodeAt(i)
      const keyChar = key.charCodeAt(i % key.length)
      result += String.fromCharCode(dataChar ^ keyChar)
    }
    return result
  }

  /**
   * XOR解密
   */
  xorDecrypt(data, key) {
    return this.xorEncrypt(data, key) // XOR操作是可逆的
  }

  /**
   * Base64编码
   */
  base64Encode(str) {
    return btoa(unescape(encodeURIComponent(str)))
  }

  /**
   * Base64解码
   */
  base64Decode(str) {
    try {
      return decodeURIComponent(escape(atob(str)))
    } catch (error) {
      console.error('Base64解码失败:', error)
      return str
    }
  }

  /**
   * 身份证号脱敏
   */
  maskIdCard(idCard) {
    if (!idCard || idCard.length < 8) return idCard
    return idCard.substring(0, 6) + '********' + idCard.substring(idCard.length - 4)
  }

  /**
   * 手机号脱敏
   */
  maskPhone(phone) {
    if (!phone || phone.length < 7) return phone
    return phone.substring(0, 3) + '****' + phone.substring(phone.length - 4)
  }

  /**
   * 邮箱脱敏
   */
  maskEmail(email) {
    if (!email || !email.includes('@')) return email
    const [username, domain] = email.split('@')
    const maskedUsername = username.substring(0, 2) + '***' + username.substring(username.length - 1)
    return maskedUsername + '@' + domain
  }

  /**
   * 姓名脱敏
   */
  maskName(name) {
    if (!name || name.length < 2) return name
    if (name.length === 2) {
      return name.charAt(0) + '*'
    }
    return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1)
  }

  /**
   * 批量数据脱敏
   */
  maskBatchData(data, fields = ['idCard', 'phone', 'email', 'name']) {
    if (!data) return data
    
    const maskedData = JSON.parse(JSON.stringify(data))
    
    fields.forEach(field => {
      if (maskedData[field]) {
        switch (field) {
          case 'idCard':
            maskedData[field] = this.maskIdCard(maskedData[field])
            break
          case 'phone':
            maskedData[field] = this.maskPhone(maskedData[field])
            break
          case 'email':
            maskedData[field] = this.maskEmail(maskedData[field])
            break
          case 'name':
            maskedData[field] = this.maskName(maskedData[field])
            break
        }
      }
    })
    
    return maskedData
  }

  /**
   * 哈希计算
   */
  hash(data, algorithm = 'md5') {
    const str = typeof data === 'string' ? data : JSON.stringify(data)
    
    // 简单的哈希实现（生产环境建议使用crypto-js）
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // 转换为32位整数
    }
    return Math.abs(hash).toString(16)
  }

  /**
   * 验证身份证号格式
   */
  validateIdCard(idCard) {
    if (!idCard) return false
    const pattern = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    return pattern.test(idCard)
  }

  /**
   * 验证手机号格式
   */
  validatePhone(phone) {
    if (!phone) return false
    const pattern = /^1[3-9]\d{9}$/
    return pattern.test(phone)
  }

  /**
   * 验证邮箱格式
   */
  validateEmail(email) {
    if (!email) return false
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(email)
  }

  /**
   * 清理危险字符（防XSS）
   */
  cleanInput(input) {
    if (!input) return input
    return input
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"')
      .replace(/'/g, "'")
      .replace(/\//g, '/')
  }

  /**
   * 数据完整性验证
   */
  verifyDataIntegrity(data, hash) {
    const calculatedHash = this.hash(data)
    return calculatedHash === hash
  }
}

// 创建单例
const dataEncryption = new DataEncryption()

// 导出
module.exports = dataEncryption
module.exports.default = dataEncryption
