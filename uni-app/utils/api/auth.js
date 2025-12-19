/**
 * 认证服务
 * 处理用户登录、Token管理、权限验证等功能
 */

const request = require('./request.js')
const DataEncryption = require('../security/data-encryption.js')

class AuthService {
  constructor() {
    this.tokenKey = 'auth_token'
    this.refreshTokenKey = 'refresh_token'
    this.userInfoKey = 'user_info'
  }

  /**
   * 用户登录
   */
  async login(username, password) {
    try {
      // 输入验证
      if (!this.validateLoginInput(username, password)) {
        return {
          success: false,
          message: '用户名或密码格式不正确'
        }
      }

      // 密码加密
      const hashedPassword = DataEncryption.hash(password)
      
      // 发起登录请求
      const response = await request.post('/api/auth/login', {
        username: username.trim(),
        password: hashedPassword,
        deviceInfo: this.getDeviceInfo(),
        timestamp: Date.now()
      })

      if (response.success) {
        const { token, refreshToken, userInfo, expiresIn } = response.data
        
        // 保存认证信息
        this.setToken(token, expiresIn)
        this.setRefreshToken(refreshToken)
        this.setUserInfo(userInfo)
        
        // 记录登录成功日志
        console.log(`用户 ${username} 登录成功`)
        
        return {
          success: true,
          data: {
            token,
            refreshToken,
            userInfo,
            expiresIn
          }
        }
      } else {
        return response
      }
      
    } catch (error) {
      console.error('登录请求失败:', error)
      return {
        success: false,
        message: error.message || '登录失败，请检查网络连接'
      }
    }
  }

  /**
   * 验证Token有效性
   */
  async validateToken(token) {
    try {
      if (!token) return false

      const response = await request.get('/api/auth/validate', {
        token
      })

      return response.success
    } catch (error) {
      console.error('Token验证失败:', error)
      return false
    }
  }

  /**
   * 刷新Token
   */
  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken()
      if (!refreshToken) {
        throw new Error('没有可用的刷新令牌')
      }

      const response = await request.post('/api/auth/refresh', {
        refreshToken
      })

      if (response.success) {
        const { token, refreshToken: newRefreshToken, expiresIn } = response.data
        
        this.setToken(token, expiresIn)
        if (newRefreshToken) {
          this.setRefreshToken(newRefreshToken)
        }
        
        return {
          success: true,
          token,
          expiresIn
        }
      } else {
        throw new Error(response.message || 'Token刷新失败')
      }
      
    } catch (error) {
      console.error('Token刷新失败:', error)
      
      // 刷新失败，清除认证信息
      this.clearAuth()
      
      return {
        success: false,
        message: error.message
      }
    }
  }

  /**
   * 退出登录
   */
  async logout() {
    try {
      const token = this.getToken()
      if (token) {
        // 通知服务器退出登录
        await request.post('/api/auth/logout', {
          token
        }).catch(error => {
          console.warn('服务器退出登录失败:', error)
        })
      }
      
      // 清除本地认证信息
      this.clearAuth()
      
      console.log('用户已退出登录')
      
      return {
        success: true
      }
      
    } catch (error) {
      console.error('退出登录失败:', error)
      
      // 清除本地认证信息
      this.clearAuth()
      
      return {
        success: true // 退出登录总是成功的
      }
    }
  }

  /**
   * 修改密码
   */
  async changePassword(oldPassword, newPassword) {
    try {
      // 输入验证
      if (!this.validatePasswordChange(oldPassword, newPassword)) {
        return {
          success: false,
          message: '密码格式不正确'
        }
      }

      const token = this.getToken()
      if (!token) {
        return {
          success: false,
          message: '未登录'
        }
      }

      // 密码加密
      const hashedOldPassword = DataEncryption.hash(oldPassword)
      const hashedNewPassword = DataEncryption.hash(newPassword)

      const response = await request.post('/api/auth/change-password', {
        oldPassword: hashedOldPassword,
        newPassword: hashedNewPassword
      })

      return response
      
    } catch (error) {
      console.error('修改密码失败:', error)
      return {
        success: false,
        message: error.message || '修改密码失败'
      }
    }
  }

  /**
   * 获取用户信息
   */
  getUserInfo() {
    try {
      const userInfoStr = uni.getStorageSync(this.userInfoKey)
      if (userInfoStr) {
        return JSON.parse(userInfoStr)
      }
      return null
    } catch (error) {
      console.error('获取用户信息失败:', error)
      return null
    }
  }

  /**
   * 设置用户信息
   */
  setUserInfo(userInfo) {
    try {
      const userInfoStr = JSON.stringify(userInfo)
      uni.setStorageSync(this.userInfoKey, userInfoStr)
    } catch (error) {
      console.error('保存用户信息失败:', error)
    }
  }

  /**
   * 获取访问令牌
   */
  getToken() {
    try {
      return uni.getStorageSync(this.tokenKey)
    } catch (error) {
      console.error('获取Token失败:', error)
      return null
    }
  }

  /**
   * 设置访问令牌
   */
  setToken(token, expiresIn) {
    try {
      uni.setStorageSync(this.tokenKey, token)
      
      // 设置过期时间
      if (expiresIn) {
        const expireTime = Date.now() + (expiresIn * 1000)
        uni.setStorageSync('token_expire_time', expireTime)
      }
    } catch (error) {
      console.error('保存Token失败:', error)
    }
  }

  /**
   * 获取刷新令牌
   */
  getRefreshToken() {
    try {
      return uni.getStorageSync(this.refreshTokenKey)
    } catch (error) {
      console.error('获取RefreshToken失败:', error)
      return null
    }
  }

  /**
   * 设置刷新令牌
   */
  setRefreshToken(refreshToken) {
    try {
      uni.setStorageSync(this.refreshTokenKey, refreshToken)
    } catch (error) {
      console.error('保存RefreshToken失败:', error)
    }
  }

  /**
   * 清除认证信息
   */
  clearAuth() {
    try {
      uni.removeStorageSync(this.tokenKey)
      uni.removeStorageSync(this.refreshTokenKey)
      uni.removeStorageSync(this.userInfoKey)
      uni.removeStorageSync('token_expire_time')
    } catch (error) {
      console.error('清除认证信息失败:', error)
    }
  }

  /**
   * 检查是否已登录
   */
  isLoggedIn() {
    try {
      const token = this.getToken()
      const expireTime = uni.getStorageSync('token_expire_time')
      
      if (!token) return false
      
      // 检查Token是否过期
      if (expireTime && Date.now() >= expireTime) {
        this.clearAuth()
        return false
      }
      
      return true
    } catch (error) {
      console.error('检查登录状态失败:', error)
      return false
    }
  }

  /**
   * 检查Token是否即将过期
   */
  isTokenExpiringSoon(minutesBeforeExpiry = 5) {
    try {
      const expireTime = uni.getStorageSync('token_expire_time')
      if (!expireTime) return false
      
      const threshold = minutesBeforeExpiry * 60 * 1000
      const currentTime = Date.now()
      
      return expireTime - currentTime <= threshold
    } catch (error) {
      console.error('检查Token过期时间失败:', error)
      return false
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
        appName: '智慧党建',
        appVersion: '1.0.0'
      }
    } catch (error) {
      console.error('获取设备信息失败:', error)
      return {}
    }
  }

  /**
   * 验证登录输入
   */
  validateLoginInput(username, password) {
    if (!username || !password) return false
    
    // 清理输入
    const cleanUsername = DataEncryption.cleanInput(username)
    const cleanPassword = DataEncryption.cleanInput(password)
    
    // 检查是否包含危险字符
    if (cleanUsername !== username || cleanPassword !== password) {
      console.warn('输入包含危险字符')
      return false
    }
    
    // 基本格式验证
    if (username.length < 2 || username.length > 50) return false
    if (password.length < 6 || password.length > 100) return false
    
    return true
  }

  /**
   * 验证密码修改输入
   */
  validatePasswordChange(oldPassword, newPassword) {
    if (!oldPassword || !newPassword) return false
    if (newPassword.length < 6 || newPassword.length > 100) return false
    
    // 清理输入
    const cleanOldPassword = DataEncryption.cleanInput(oldPassword)
    const cleanNewPassword = DataEncryption.cleanInput(newPassword)
    
    return cleanOldPassword === oldPassword && cleanNewPassword === newPassword
  }

  /**
   * 获取用户权限
   */
  getUserPermissions() {
    const userInfo = this.getUserInfo()
    if (!userInfo || !userInfo.role) return []
    
    // 根据角色返回权限
    const rolePermissions = {
      'admin': [
        'system:manage',
        'user:manage',
        'organization:manage',
        'member:manage',
        'opinion:manage',
        'news:manage',
        'notice:manage'
      ],
      'park_manager': [
        'organization:view',
        'member:view',
        'opinion:view',
        'opinion:manage',
        'news:view',
        'news:manage',
        'notice:view',
        'notice:manage',
        'stats:view'
      ],
      'enterprise_manager': [
        'member:view',
        'member:manage',
        'opinion:create',
        'opinion:view',
        'news:view',
        'notice:view'
      ],
      'member': [
        'opinion:create',
        'opinion:view',
        'news:view',
        'notice:view',
        'profile:view',
        'profile:edit'
      ]
    }
    
    return rolePermissions[userInfo.role] || []
  }

  /**
   * 检查用户是否有指定权限
   */
  hasPermission(permission) {
    const permissions = this.getUserPermissions()
    return permissions.includes(permission)
  }

  /**
   * 获取当前用户组织ID
   */
  getCurrentOrganizationId() {
    const userInfo = this.getUserInfo()
    return userInfo ? userInfo.organizationId : null
  }

  /**
   * 检查是否为管理员
   */
  isAdmin() {
    const userInfo = this.getUserInfo()
    return userInfo && userInfo.role === 'admin'
  }

  /**
   * 检查是否为园区管理员
   */
  isParkManager() {
    const userInfo = this.getUserInfo()
    return userInfo && userInfo.role === 'park_manager'
  }

  /**
   * 检查是否为企业管理员
   */
  isEnterpriseManager() {
    const userInfo = this.getUserInfo()
    return userInfo && userInfo.role === 'enterprise_manager'
  }

  /**
   * 检查是否为普通党员
   */
  isMember() {
    const userInfo = this.getUserInfo()
    return userInfo && userInfo.role === 'member'
  }
}

// 创建单例
const authService = new AuthService()

// 导出
module.exports = authService
module.exports.default = authService
