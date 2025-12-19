<template>
  <view class="login-container">
    <!-- 自定义导航栏 -->
    <custom-header title="智慧党建登录"></custom-header>
    
    <!-- 登录表单 -->
    <view class="login-form">
      <view class="logo-section">
        <image class="logo" src="/static/images/logo.png" mode="aspectFit"></image>
        <text class="app-title">智慧党建</text>
        <text class="app-subtitle">Smart Party Building</text>
        <view class="security-badge">🔒 数据加密保护</view>
      </view>
      
      <view class="form-section">
        <view class="form-group">
          <text class="form-label">用户名</text>
          <input 
            class="form-input" 
            v-model="formData.username" 
            placeholder="请输入用户名"
            :disabled="loading"
            @input="onInputChange"
          />
        </view>
        
        <view class="form-group">
          <text class="form-label">密码</text>
          <input 
            class="form-input" 
            v-model="formData.password" 
            placeholder="请输入密码"
            :disabled="loading"
            :password="!showPassword"
            @input="onInputChange"
          />
          <text class="password-toggle" @click="togglePassword">
            {{ showPassword ? '👁️' : '👁️‍🗨️' }}
          </text>
        </view>
        
        <view class="form-options">
          <label class="checkbox-label">
            <checkbox 
              :checked="formData.rememberMe" 
              @tap="toggleRemember"
              :disabled="loading"
              color="#C62E2E"
            />
            <text>记住我</text>
          </label>
          <text class="forgot-password">忘记密码？</text>
        </view>
        
        <!-- 登录按钮 -->
        <button 
          class="login-btn" 
          :class="{ 'btn-loading': loading }"
          :disabled="loading || !canSubmit"
          @tap="handleLogin"
        >
          <text v-if="!loading">登录</text>
          <text v-else>登录中...</text>
        </button>
        
        <!-- 微信登录 -->
        <button 
          class="wechat-login-btn" 
          :disabled="loading"
          open-type="getUserInfo"
          @getuserinfo="handleWechatLogin"
        >
          <text>📱 微信快捷登录</text>
        </button>
      </view>
      
      <!-- 隐私政策 -->
      <view class="privacy-section">
        <text class="privacy-text">
          登录即表示同意
          <text class="privacy-link" @tap="showPrivacyPolicy">《隐私政策》</text>
          和
          <text class="privacy-link" @tap="showUserAgreement">《用户协议》</text>
        </text>
        <text class="security-info">本应用采用端到端加密，保护您的数据安全</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      formData: {
        username: '',
        password: '',
        rememberMe: false
      },
      loading: false,
      showPassword: false,
      loginAttempts: 0,
      maxAttempts: 5,
      lockoutTime: 0
    }
  },
  computed: {
    canSubmit() {
      return this.formData.username.trim() && this.formData.password.trim()
    }
  },
  onLoad() {
    // 检查是否已经登录
    this.checkExistingLogin()
    
    // 恢复记住的用户名
    this.restoreRememberedUsername()
  },
  methods: {
    // 检查已登录状态
    async checkExistingLogin() {
      try {
        const token = uni.getStorageSync('auth_token')
        if (token) {
          // 验证token有效性
          const AuthService = require('../../utils/api/auth.js')
          const isValid = await AuthService.validateToken(token)
          
          if (isValid) {
            // 已登录，跳转到首页
            uni.reLaunch({
              url: '/pages/index/index'
            })
          } else {
            // token无效，清除本地存储
            uni.removeStorageSync('auth_token')
            uni.removeStorageSync('user_info')
          }
        }
      } catch (error) {
        console.error('检查登录状态失败:', error)
      }
    },
    
    // 恢复记住的用户名
    restoreRememberedUsername() {
      const rememberedUser = uni.getStorageSync('remembered_username')
      if (rememberedUser) {
        this.formData.username = rememberedUser
        this.formData.rememberMe = true
      }
    },
    
    // 输入变化处理
    onInputChange() {
      // 清除错误状态
      this.clearError()
    },
    
    // 切换密码显示
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    
    // 切换记住我
    toggleRemember() {
      this.formData.rememberMe = !this.formData.rememberMe
    },
    
    // 清除错误状态
    clearError() {
      // 重置登录尝试次数
      if (this.loginAttempts > 0) {
        this.loginAttempts = 0
      }
    },
    
    // 处理登录
    async handleLogin() {
      if (!this.canSubmit) {
        uni.showToast({
          title: '请输入用户名和密码',
          icon: 'none'
        })
        return
      }
      
      if (this.isLockedOut()) {
        uni.showToast({
          title: `登录失败次数过多，请等待${this.getLockoutRemainingTime()}秒后重试`,
          icon: 'none'
        })
        return
      }
      
      this.loading = true
      
      try {
        // 输入验证
        if (!this.validateInput()) {
          this.loading = false
          return
        }
        
        // 调用登录接口
        const AuthService = require('../../utils/api/auth.js')
        const response = await AuthService.login(this.formData.username, this.formData.password)
        
        if (response.success) {
          // 登录成功
          await this.handleLoginSuccess(response.data)
        } else {
          // 登录失败
          await this.handleLoginFailure(response.message)
        }
      } catch (error) {
        console.error('登录失败:', error)
        await this.handleLoginFailure(error.message || '登录失败，请检查网络连接')
      } finally {
        this.loading = false
      }
    },
    
    // 输入验证
    validateInput() {
      const username = this.formData.username.trim()
      const password = this.formData.password.trim()
      
      if (username.length < 2) {
        uni.showToast({
          title: '用户名至少需要2个字符',
          icon: 'none'
        })
        return false
      }
      
      if (password.length < 6) {
        uni.showToast({
          title: '密码至少需要6个字符',
          icon: 'none'
        })
        return false
      }
      
      // XSS防护
      const DataEncryption = require('../../utils/security/data-encryption.js')
      if (DataEncryption.cleanInput(username) !== username || 
          DataEncryption.cleanInput(password) !== password) {
        uni.showToast({
          title: '输入包含非法字符',
          icon: 'none'
        })
        return false
      }
      
      return true
    },
    
    // 处理登录成功
    async handleLoginSuccess(data) {
      try {
        // 保存认证信息
        uni.setStorageSync('auth_token', data.token)
        uni.setStorageSync('refresh_token', data.refreshToken)
        uni.setStorageSync('user_info', data.userInfo)
        
        // 记住用户名
        if (this.formData.rememberMe) {
          uni.setStorageSync('remembered_username', this.formData.username)
        } else {
          uni.removeStorageSync('remembered_username')
        }
        
        // 记录审计日志
        const AuditLogger = require('../../utils/security/audit-logger.js')
        await AuditLogger.log('LOGIN_SUCCESS', {
          username: this.formData.username,
          userId: data.userInfo.id,
          timestamp: Date.now()
        })
        
        // 跳转到首页
        uni.showToast({
          title: '登录成功',
          icon: 'success'
        })
        
        setTimeout(() => {
          uni.reLaunch({
            url: '/pages/index/index'
          })
        }, 1000)
        
      } catch (error) {
        console.error('处理登录成功信息失败:', error)
        uni.showToast({
          title: '登录异常',
          icon: 'none'
        })
      }
    },
    
    // 处理登录失败
    async handleLoginFailure(message) {
      this.loginAttempts++
      
      // 记录审计日志
      const AuditLogger = require('../../utils/security/audit-logger.js')
      await AuditLogger.log('LOGIN_FAILURE', {
        username: this.formData.username,
        attempts: this.loginAttempts,
        timestamp: Date.now()
      })
      
      // 检查是否需要锁定账户
      if (this.loginAttempts >= this.maxAttempts) {
        this.lockoutTime = Date.now() + (10 * 60 * 1000) // 锁定10分钟
        uni.showToast({
          title: '登录失败次数过多，账户已锁定10分钟',
          icon: 'none'
        })
      } else {
        uni.showToast({
          title: message || `登录失败，还可尝试${this.maxAttempts - this.loginAttempts}次`,
          icon: 'none'
        })
      }
    },
    
    // 检查是否被锁定
    isLockedOut() {
      if (this.lockoutTime === 0) return false
      return Date.now() < this.lockoutTime
    },
    
    // 获取锁定剩余时间
    getLockoutRemainingTime() {
      if (this.lockoutTime === 0) return 0
      const remaining = Math.ceil((this.lockoutTime - Date.now()) / 1000)
      return Math.max(0, remaining)
    },
    
    // 微信登录
    handleWechatLogin(e) {
      if (e.detail.errMsg === 'getUserInfo:ok') {
        uni.showToast({
          title: '微信登录功能开发中',
          icon: 'none'
        })
      } else {
        uni.showToast({
          title: '微信授权失败',
          icon: 'none'
        })
      }
    },
    
    // 显示隐私政策
    showPrivacyPolicy() {
      uni.showModal({
        title: '隐私政策',
        content: '本应用严格遵循《个人信息保护法》，保护用户隐私安全...',
        showCancel: false
      })
    },
    
    // 显示用户协议
    showUserAgreement() {
      uni.showModal({
        title: '用户协议',
        content: '用户在使用本应用时应遵守相关法律法规...',
        showCancel: false
      })
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #C62E2E 0%, #A62626 100%);
  display: flex;
  flex-direction: column;
}

.login-form {
  flex: 1;
  padding: 40px 30px 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.logo-section {
  text-align: center;
  margin-bottom: 50px;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  border-radius: 16px;
}

.app-title {
  display: block;
  font-size: 28px;
  font-weight: bold;
  color: white;
  margin-bottom: 8px;
}

.app-subtitle {
  display: block;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20px;
}

.security-badge {
  display: inline-block;
  padding: 6px 12px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  backdrop-filter: blur(10px);
}

.form-section {
  background-color: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.form-group {
  position: relative;
  margin-bottom: 25px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 15px 45px 15px 15px;
  border: 2px solid #E5E5E5;
  border-radius: 10px;
  font-size: 16px;
  background-color: #FAFAFA;
  transition: all 0.3s ease;
}

.form-input:focus {
  border-color: #C62E2E;
  background-color: white;
  outline: none;
}

.form-input:disabled {
  background-color: #F5F5F5;
  color: #999;
}

.password-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  cursor: pointer;
  z-index: 1;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.checkbox-label checkbox {
  margin-right: 8px;
}

.forgot-password {
  font-size: 14px;
  color: #C62E2E;
  cursor: pointer;
}

.login-btn {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #C62E2E 0%, #A62626 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.login-btn:active {
  transform: translateY(1px);
}

.login-btn:disabled {
  background-color: #CCC;
  transform: none;
}

.btn-loading {
  opacity: 0.8;
}

.wechat-login-btn {
  width: 100%;
  padding: 12px;
  background-color: #07C160;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.wechat-login-btn:active {
  background-color: #06AD56;
}

.wechat-login-btn:disabled {
  background-color: #A5D9B5;
}

.privacy-section {
  margin-top: 30px;
  text-align: center;
}

.privacy-text {
  display: block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin-bottom: 10px;
}

.privacy-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: underline;
  cursor: pointer;
}

.security-info {
  display: block;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.4;
}
</style>
