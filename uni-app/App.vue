<template>
  <view id="app">
    <!-- 应用启动页面 -->
  </view>
</template>

<script>
export default {
  name: 'App',
  onLaunch: function() {
    console.log('App Launch')
    
    // 初始化安全存储
    this.initSecurity()
    
    // 检查登录状态
    this.checkLoginStatus()
    
    // 初始化应用配置
    this.initConfig()
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  },
  onError: function(err) {
    console.error('App Error:', err)
  },
  methods: {
    // 初始化安全功能
    initSecurity() {
      // 初始化安全存储
      const SecurityStorage = require('./utils/security/storage.js')
      SecurityStorage.init()
      
      // 初始化数据加密
      const DataEncryption = require('./utils/security/data-encryption.js')
      DataEncryption.init()
    },
    
    // 检查登录状态
    async checkLoginStatus() {
      try {
        const token = uni.getStorageSync('auth_token')
        if (token) {
          // 验证token有效性
          const AuthService = require('./utils/api/auth.js')
          const isValid = await AuthService.validateToken(token)
          
          if (isValid) {
            // token有效，设置全局用户信息
            const userInfo = uni.getStorageSync('user_info')
            this.$store.commit('setUserInfo', userInfo)
            this.$store.commit('setToken', token)
          } else {
            // token无效，清除本地存储
            this.logout()
          }
        }
      } catch (error) {
        console.error('检查登录状态失败:', error)
        this.logout()
      }
    },
    
    // 初始化应用配置
    initConfig() {
      // 设置全局配置
      uni.setStorageSync('app_config', {
        version: '1.0.0',
        api_base_url: 'https://your-api-domain.com',
        enable_debug: false
      })
    },
    
    // 退出登录
    logout() {
      // 清除本地存储
      uni.removeStorageSync('auth_token')
      uni.removeStorageSync('user_info')
      uni.removeStorageSync('refresh_token')
      
      // 清除全局状态
      this.$store.commit('clearUserInfo')
      this.$store.commit('clearToken')
      
      // 跳转到登录页
      uni.reLaunch({
        url: '/pages/login/login'
      })
    }
  }
}
</script>

<style>
/* 全局样式 */
page {
  background-color: #F8F8F8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

/* 主题色 */
.primary-color {
  color: #C62E2E;
}

.bg-primary {
  background-color: #C62E2E;
}

.border-primary {
  border-color: #C62E2E;
}

/* 通用样式 */
.flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.flex-center {
  justify-content: center;
  align-items: center;
}

.flex-between {
  justify-content: space-between;
}

.flex-around {
  justify-content: space-around;
}

.flex-1 {
  flex: 1;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.text-left {
  text-align: left;
}

/* 间距 */
.m-10 { margin: 10px; }
.mt-10 { margin-top: 10px; }
.mb-10 { margin-bottom: 10px; }
.ml-10 { margin-left: 10px; }
.mr-10 { margin-right: 10px; }

.p-10 { padding: 10px; }
.pt-10 { padding-top: 10px; }
.pb-10 { padding-bottom: 10px; }
.pl-10 { padding-left: 10px; }
.pr-10 { padding-right: 10px; }

.m-20 { margin: 20px; }
.mt-20 { margin-top: 20px; }
.mb-20 { margin-bottom: 20px; }
.ml-20 { margin-left: 20px; }
.mr-20 { margin-right: 20px; }

.p-20 { padding: 20px; }
.pt-20 { padding-top: 20px; }
.pb-20 { padding-bottom: 20px; }
.pl-20 { padding-left: 20px; }
.pr-20 { padding-right: 20px; }

/* 字体大小 */
.text-xs { font-size: 12px; }
.text-sm { font-size: 14px; }
.text-md { font-size: 16px; }
.text-lg { font-size: 18px; }
.text-xl { font-size: 20px; }
.text-xxl { font-size: 24px; }

/* 按钮样式 */
.btn {
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 16px;
  text-align: center;
  border: none;
  outline: none;
}

.btn-primary {
  background-color: #C62E2E;
  color: white;
}

.btn-primary:active {
  background-color: #A62626;
}

.btn-secondary {
  background-color: #F5F5F5;
  color: #666;
  border: 1px solid #DDD;
}

.btn-secondary:active {
  background-color: #E5E5E5;
}

/* 卡片样式 */
.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-header {
  padding: 16px 20px;
  border-bottom: 1px solid #F0F0F0;
  font-weight: 600;
  font-size: 16px;
}

.card-body {
  padding: 20px;
}

.card-footer {
  padding: 16px 20px;
  border-top: 1px solid #F0F0F0;
  background-color: #FAFAFA;
}

/* 表单样式 */
.form-group {
  margin-bottom: 20px;
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
  padding: 12px 16px;
  border: 1px solid #DDD;
  border-radius: 6px;
  font-size: 16px;
  background-color: white;
}

.form-input:focus {
  border-color: #C62E2E;
  outline: none;
}

.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #DDD;
  border-radius: 6px;
  font-size: 16px;
  background-color: white;
  min-height: 120px;
}

.form-textarea:focus {
  border-color: #C62E2E;
  outline: none;
}

/* 加载状态 */
.loading {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #C62E2E;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 空状态 */
.empty {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-image {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  opacity: 0.3;
}

/* 安全标识 */
.security-badge {
  display: inline-block;
  padding: 4px 8px;
  background-color: #E8F5E8;
  color: #4CAF50;
  border-radius: 4px;
  font-size: 12px;
}

/* 状态标识 */
.status-active {
  color: #4CAF50;
}

.status-inactive {
  color: #FF9800;
}

.status-deleted {
  color: #F44336;
}
</style>
