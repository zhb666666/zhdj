/**
 * 网络请求封装
 * 基于uni-app网络API进行封装，支持加密、认证、错误处理
 */

class Request {
  constructor(config = {}) {
    this.baseURL = config.baseURL || 'https://your-api-domain.com'
    this.timeout = config.timeout || 10000
    this.enableEncryption = config.enableEncryption !== false
    this.enableAuth = config.enableAuth !== false
  }

  /**
   * 获取请求头
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json;charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest'
    }

    // 添加认证token
    if (this.enableAuth) {
      const token = uni.getStorageSync('auth_token')
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
    }

    // 添加设备信息
    headers['X-Device-Info'] = JSON.stringify({
      platform: uni.getSystemInfoSync().platform,
      model: uni.getSystemInfoSync().model,
      version: uni.getSystemInfoSync().version
    })

    return headers
  }

  /**
   * 请求拦截器
   */
  requestInterceptor(config) {
    // 添加请求时间戳（防重放攻击）
    config.timestamp = Date.now()
    
    // 数据加密
    if (this.enableEncryption && config.data) {
      const DataEncryption = require('../security/data-encryption.js')
      config.data = DataEncryption.encrypt(JSON.stringify(config.data))
    }

    // 添加请求标识
    config.requestId = this.generateRequestId()
    
    console.log('发起请求:', config.url, config.data)
    return config
  }

  /**
   * 响应拦截器
   */
  responseInterceptor(response) {
    const { data, statusCode } = response
    
    // 记录响应时间
    console.log(`请求完成: ${response.config.url} [${statusCode}]`)
    
    if (statusCode === 200) {
      // 数据解密
      if (this.enableEncryption && data.encrypted) {
        const DataEncryption = require('../security/data-encryption.js')
        const decryptedData = DataEncryption.decrypt(data.content)
        return JSON.parse(decryptedData)
      }
      return data
    } else if (statusCode === 401) {
      // Token过期，跳转到登录页
      this.handleUnauthorized()
      return Promise.reject(new Error('登录已过期，请重新登录'))
    } else if (statusCode === 403) {
      // 权限不足
      uni.showToast({
        title: '权限不足',
        icon: 'none'
      })
      return Promise.reject(new Error('权限不足'))
    } else if (statusCode >= 500) {
      // 服务器错误
      uni.showToast({
        title: '服务器错误，请稍后重试',
        icon: 'none'
      })
      return Promise.reject(new Error('服务器错误'))
    } else {
      // 其他错误
      const message = data?.message || `请求失败 (${statusCode})`
      uni.showToast({
        title: message,
        icon: 'none'
      })
      return Promise.reject(new Error(message))
    }
  }

  /**
   * 处理未授权
   */
  handleUnauthorized() {
    // 清除本地认证信息
    uni.removeStorageSync('auth_token')
    uni.removeStorageSync('user_info')
    uni.removeStorageSync('refresh_token')
    
    // 跳转到登录页
    uni.reLaunch({
      url: '/pages/login/login'
    })
  }

  /**
   * 生成请求ID
   */
  generateRequestId() {
    return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  /**
   * GET请求
   */
  get(url, params = {}, config = {}) {
    return this.request({
      url: this.baseURL + url,
      method: 'GET',
      data: params,
      ...config
    })
  }

  /**
   * POST请求
   */
  post(url, data = {}, config = {}) {
    return this.request({
      url: this.baseURL + url,
      method: 'POST',
      data,
      ...config
    })
  }

  /**
   * PUT请求
   */
  put(url, data = {}, config = {}) {
    return this.request({
      url: this.baseURL + url,
      method: 'PUT',
      data,
      ...config
    })
  }

  /**
   * DELETE请求
   */
  delete(url, config = {}) {
    return this.request({
      url: this.baseURL + url,
      method: 'DELETE',
      ...config
    })
  }

  /**
   * 统一请求方法
   */
  request(config) {
    return new Promise((resolve, reject) => {
      // 应用请求拦截器
      const processedConfig = this.requestInterceptor({
        method: 'GET',
        timeout: this.timeout,
        headers: this.getHeaders(),
        ...config
      })

      uni.request({
        url: processedConfig.url,
        method: processedConfig.method,
        data: processedConfig.data,
        header: processedConfig.headers,
        timeout: processedConfig.timeout,
        success: (response) => {
          try {
            this.responseInterceptor(response).then(resolve).catch(reject)
          } catch (error) {
            reject(error)
          }
        },
        fail: (error) => {
          console.error('请求失败:', error)
          
          // 网络错误处理
          if (error.errMsg.includes('timeout')) {
            uni.showToast({
              title: '请求超时，请检查网络',
              icon: 'none'
            })
          } else if (error.errMsg.includes('fail')) {
            uni.showToast({
              title: '网络连接失败',
              icon: 'none'
            })
          } else {
            uni.showToast({
              title: '网络错误',
              icon: 'none'
            })
          }
          
          reject(error)
        }
      })
    })
  }

  /**
   * 文件上传
   */
  upload(url, filePath, formData = {}, config = {}) {
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: this.baseURL + url,
        filePath,
        name: config.name || 'file',
        formData,
        header: this.getHeaders(),
        success: (response) => {
          try {
            const data = JSON.parse(response.data)
            if (response.statusCode === 200) {
              resolve(data)
            } else {
              reject(new Error('上传失败'))
            }
          } catch (error) {
            reject(error)
          }
        },
        fail: reject
      })
    })
  }
}

// 创建默认实例
const request = new Request()

// 导出
module.exports = request
module.exports.default = request
