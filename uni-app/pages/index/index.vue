<template>
  <view class="index-container">
    <!-- 自定义导航栏 -->
    <custom-header title="智慧党建">
      <template v-slot:right>
        <view class="header-actions">
          <text class="notification-btn" @tap="showNotifications">🔔</text>
          <text class="settings-btn" @tap="showSettings">⚙️</text>
        </view>
      </template>
    </custom-header>
    
    <!-- 加载状态 -->
    <view v-if="loading" class="loading">
      <view class="loading-spinner"></view>
      <text>加载中...</text>
    </view>
    
    <!-- 主要内容 -->
    <view v-else class="main-content">
      <!-- 用户信息卡片 -->
      <view class="user-card card">
        <view class="user-info">
          <view class="avatar-section">
            <image class="avatar" :src="userInfo.avatar || '/static/images/default-avatar.png'" mode="aspectFill"></image>
            <view class="security-indicator">🔒</view>
          </view>
          <view class="user-details">
            <text class="user-name">{{ userInfo.name || '用户' }}</text>
            <text class="user-role">{{ getRoleName(userInfo.role) }}</text>
            <text class="organization-name">{{ userInfo.organizationName || '未知组织' }}</text>
          </view>
        </view>
        <view class="user-actions">
          <text class="logout-btn" @tap="handleLogout">退出</text>
        </view>
      </view>
      
      <!-- 数据统计看板 (仅园区管理员可见) -->
      <view v-if="isParkManager" class="stats-section">
        <view class="stats-header">
          <text class="section-title">数据概览</text>
          <text class="refresh-btn" @tap="refreshStats">🔄</text>
        </view>
        
        <view class="stats-grid">
          <view class="stat-item" @tap="navigateTo('/pages/members/members')">
            <view class="stat-icon">👥</view>
            <view class="stat-content">
              <text class="stat-number">{{ stats.partyMemberCount || 0 }}</text>
              <text class="stat-label">党员总数</text>
            </view>
          </view>
          
          <view class="stat-item" @tap="navigateTo('/pages/members/members')">
            <view class="stat-icon">🏢</view>
            <view class="stat-content">
              <text class="stat-number">{{ stats.enterpriseCount || 0 }}</text>
              <text class="stat-label">企业数量</text>
            </view>
          </view>
          
          <view class="stat-item" @tap="navigateTo('/pages/opinions/opinions')">
            <view class="stat-icon">📝</view>
            <view class="stat-content">
              <text class="stat-number">{{ stats.opinionCount || 0 }}</text>
              <text class="stat-label">意见稿</text>
            </view>
          </view>
          
          <view class="stat-item" @tap="navigateTo('/pages/news/news')">
            <view class="stat-icon">📰</view>
            <view class="stat-content">
              <text class="stat-number">{{ stats.newsCount || 0 }}</text>
              <text class="stat-label">党建资讯</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 快捷功能 -->
      <view class="quick-actions-section">
        <view class="section-title">快捷功能</view>
        
        <view class="actions-grid">
          <view class="action-item" @tap="navigateTo('/pages/members/members')">
            <view class="action-icon">👤</view>
            <text class="action-text">党员管理</text>
            <text class="action-desc">管理党员信息</text>
          </view>
          
          <view class="action-item" @tap="navigateTo('/pages/opinions/opinions')">
            <view class="action-icon">💭</view>
            <text class="action-text">意见稿</text>
            <text class="action-desc">提交意见建议</text>
          </view>
          
          <view class="action-item" @tap="navigateTo('/pages/news/news')">
            <view class="action-icon">📢</view>
            <text class="action-text">党建资讯</text>
            <text class="action-desc">查看党建动态</text>
          </view>
          
          <view class="action-item" @tap="navigateTo('/pages/notices/notices')">
            <view class="action-icon">📋</view>
            <text class="action-text">通知公告</text>
            <text class="action-desc">查看最新公告</text>
          </view>
          
          <!-- 管理员专属功能 -->
          <view v-if="isAdmin" class="action-item" @tap="showAdminPanel">
            <view class="action-icon">⚙️</view>
            <text class="action-text">系统管理</text>
            <text class="action-desc">系统设置管理</text>
          </view>
          
          <view v-if="isEnterpriseManager" class="action-item" @tap="showEnterprisePanel">
            <view class="action-icon">🏢</view>
            <text class="action-text">企业管理</text>
            <text class="action-desc">企业管理功能</text>
          </view>
        </view>
      </view>
      
      <!-- 党建资讯轮播 -->
      <view v-if="newsList.length > 0" class="news-section">
        <view class="section-title">党建资讯</view>
        
        <swiper class="news-swiper" autoplay="true" interval="5000" duration="500">
          <swiper-item v-for="news in newsList" :key="news.id">
            <view class="news-card" @tap="viewNewsDetail(news)">
              <image class="news-image" :src="news.iconUrl || '/static/images/default-news.jpg'" mode="aspectFill"></image>
              <view class="news-content">
                <text class="news-title">{{ news.title }}</text>
                <text class="news-time">{{ formatTime(news.publishTime) }}</text>
              </view>
            </view>
          </swiper-item>
        </swiper>
      </view>
      
      <!-- 最近活动 -->
      <view class="activities-section">
        <view class="section-title">最近活动</view>
        
        <view class="activity-list">
          <view class="activity-item" v-for="activity in recentActivities" :key="activity.id">
            <view class="activity-icon">{{ activity.icon }}</view>
            <view class="activity-content">
              <text class="activity-title">{{ activity.title }}</text>
              <text class="activity-time">{{ formatTime(activity.timestamp) }}</text>
            </view>
            <text class="activity-arrow">▶</text>
          </view>
        </view>
        
        <view v-if="recentActivities.length === 0" class="empty-state">
          <text>暂无最近活动</text>
        </view>
      </view>
    </view>
    
    <!-- 安全提示 -->
    <view class="security-tip">
      <text class="tip-icon">🔒</text>
      <text class="tip-text">数据全程加密保护，符合国家信息安全标准</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      loading: true,
      userInfo: {},
      stats: {
        partyMemberCount: 0,
        enterpriseCount: 0,
        opinionCount: 0,
        newsCount: 0
      },
      newsList: [],
      recentActivities: []
    }
  },
  computed: {
    isAdmin() {
      return this.userInfo.role === 'admin'
    },
    isParkManager() {
      return this.userInfo.role === 'park_manager'
    },
    isEnterpriseManager() {
      return this.userInfo.role === 'enterprise_manager'
    }
  },
  onLoad() {
    this.loadUserInfo()
    this.loadData()
  },
  onShow() {
    this.refreshData()
  },
  onPullDownRefresh() {
    this.refreshData()
  },
  methods: {
    // 加载用户信息
    async loadUserInfo() {
      try {
        const AuthService = require('../../utils/api/auth.js')
        this.userInfo = AuthService.getUserInfo() || {}
      } catch (error) {
        console.error('加载用户信息失败:', error)
      }
    },
    
    // 加载数据
    async loadData() {
      try {
        this.loading = true
        
        // 并行加载数据
        await Promise.all([
          this.loadStats(),
          this.loadNewsList(),
          this.loadRecentActivities()
        ])
        
      } catch (error) {
        console.error('加载数据失败:', error)
        uni.showToast({
          title: '加载数据失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    
    // 加载统计数据
    async loadStats() {
      if (!this.isParkManager) return
      
      try {
        const request = require('../../utils/api/request.js')
        const response = await request.get('/api/stats/overview')
        
        if (response.success) {
          this.stats = response.data
        }
      } catch (error) {
        console.error('加载统计数据失败:', error)
      }
    },
    
    // 加载新闻列表
    async loadNewsList() {
      try {
        const request = require('../../utils/api/request.js')
        const response = await request.get('/api/news/list', {
          page: 1,
          size: 5,
          carousel: true
        })
        
        if (response.success) {
          this.newsList = response.data.list || []
        }
      } catch (error) {
        console.error('加载新闻列表失败:', error)
      }
    },
    
    // 加载最近活动
    async loadRecentActivities() {
      try {
        const AuditLogger = require('../../utils/security/audit-logger.js')
        const logs = AuditLogger.getLocalLogs(5)
        
        this.recentActivities = logs.map(log => ({
          id: log.id,
          icon: this.getActivityIcon(log.action),
          title: this.getActivityTitle(log.action),
          timestamp: log.timestamp
        }))
      } catch (error) {
        console.error('加载最近活动失败:', error)
      }
    },
    
    // 刷新数据
    async refreshData() {
      if (uni.startPullDownRefresh) {
        uni.startPullDownRefresh()
      }
      
      await this.loadData()
      
      if (uni.stopPullDownRefresh) {
        uni.stopPullDownRefresh()
      }
    },
    
    // 刷新统计
    refreshStats() {
      this.loadStats()
    },
    
    // 获取角色名称
    getRoleName(role) {
      const roleNames = {
        'admin': '系统管理员',
        'park_manager': '园区管理员',
        'enterprise_manager': '企业管理',
        'member': '普通党员'
      }
      return roleNames[role] || '未知角色'
    },
    
    // 格式化时间
    formatTime(timestamp) {
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date
      
      if (diff < 60000) { // 1分钟内
        return '刚刚'
      } else if (diff < 3600000) { // 1小时内
        return `${Math.floor(diff / 60000)}分钟前`
      } else if (diff < 86400000) { // 24小时内
        return `${Math.floor(diff / 3600000)}小时前`
      } else {
        return date.toLocaleDateString()
      }
    },
    
    // 获取活动图标
    getActivityIcon(action) {
      const iconMap = {
        'LOGIN': '🔐',
        'LOGOUT': '🚪',
        'DATA_ACCESS': '👁️',
        'DATA_MODIFICATION': '✏️',
        'OPINION_CREATE': '📝',
        'MEMBER_VIEW': '👤'
      }
      return iconMap[action] || '📋'
    },
    
    // 获取活动标题
    getActivityTitle(action) {
      const titleMap = {
        'LOGIN': '用户登录',
        'LOGOUT': '用户退出',
        'DATA_ACCESS': '数据访问',
        'DATA_MODIFICATION': '数据修改',
        'OPINION_CREATE': '提交意见',
        'MEMBER_VIEW': '查看党员'
      }
      return titleMap[action] || '系统操作'
    },
    
    // 页面跳转
    navigateTo(url) {
      uni.navigateTo({
        url
      })
    },
    
    // 查看新闻详情
    viewNewsDetail(news) {
      uni.navigateTo({
        url: `/pages/news/detail?id=${news.id}`
      })
    },
    
    // 显示通知
    showNotifications() {
      uni.navigateTo({
        url: '/pages/notifications/notifications'
      })
    },
    
    // 显示设置
    showSettings() {
      uni.navigateTo({
        url: '/pages/settings/settings'
      })
    },
    
    // 显示管理员面板
    showAdminPanel() {
      uni.navigateTo({
        url: '/pages/admin/admin'
      })
    },
    
    // 显示企业面板
    showEnterprisePanel() {
      uni.navigateTo({
        url: '/pages/enterprise/enterprise'
      })
    },
    
    // 处理退出登录
    async handleLogout() {
      uni.showModal({
        title: '确认退出',
        content: '确定要退出登录吗？',
        success: async (res) => {
          if (res.confirm) {
            try {
              const AuthService = require('../../utils/api/auth.js')
              await AuthService.logout()
              
              // 记录退出日志
              const AuditLogger = require('../../utils/security/audit-logger.js')
              await AuditLogger.logLogout(this.userInfo)
              
              uni.showToast({
                title: '已退出登录',
                icon: 'success'
              })
              
              setTimeout(() => {
                uni.reLaunch({
                  url: '/pages/login/login'
                })
              }, 1000)
            } catch (error) {
              console.error('退出登录失败:', error)
              uni.showToast({
                title: '退出失败',
                icon: 'none'
              })
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.index-container {
  min-height: 100vh;
  background-color: #F8F8F8;
  padding-bottom: 20px;
}

.main-content {
  padding: 0 16px;
}

/* 用户信息卡片 */
.user-card {
  margin: 16px 0;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.avatar-section {
  position: relative;
  margin-right: 16px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid #C62E2E;
}

.security-indicator {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 20px;
  height: 20px;
  background-color: #4CAF50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.user-details {
  flex: 1;
}

.user-name {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.user-role {
  display: block;
  font-size: 14px;
  color: #C62E2E;
  margin-bottom: 2px;
}

.organization-name {
  display: block;
  font-size: 12px;
  color: #999;
}

.user-actions {
  margin-left: 16px;
}

.logout-btn {
  padding: 8px 16px;
  background-color: #F5F5F5;
  color: #666;
  border-radius: 6px;
  font-size: 14px;
}

/* 统计看板 */
.stats-section {
  margin: 16px 0;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.refresh-btn {
  font-size: 18px;
  cursor: pointer;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat-item {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.stat-item:active {
  transform: scale(0.98);
}

.stat-icon {
  font-size: 32px;
  margin-right: 12px;
}

.stat-content {
  flex: 1;
}

.stat-number {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: #C62E2E;
  margin-bottom: 4px;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #666;
}

/* 快捷功能 */
.quick-actions-section {
  margin: 24px 0;
}

.actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 16px;
}

.action-item {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.action-item:active {
  transform: scale(0.98);
}

.action-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.action-text {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.action-desc {
  display: block;
  font-size: 12px;
  color: #999;
}

/* 新闻轮播 */
.news-section {
  margin: 24px 0;
}

.news-swiper {
  height: 160px;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 16px;
}

.news-card {
  height: 160px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.news-image {
  width: 100%;
  height: 100%;
}

.news-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 20px 16px 16px;
}

.news-title {
  display: block;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.news-time {
  display: block;
  font-size: 12px;
  opacity: 0.8;
}

/* 最近活动 */
.activities-section {
  margin: 24px 0;
}

.activity-list {
  margin-top: 16px;
}

.activity-item {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.activity-icon {
  font-size: 24px;
  margin-right: 12px;
}

.activity-content {
  flex: 1;
}

.activity-title {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 2px;
}

.activity-time {
  display: block;
  font-size: 12px;
  color: #999;
}

.activity-arrow {
  color: #CCC;
  font-size: 12px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 14px;
}

/* 安全提示 */
.security-tip {
  position: fixed;
  bottom: 20px;
  left: 16px;
  right: 16px;
  background-color: rgba(198, 46, 46, 0.9);
  color: white;
  padding: 12px 16px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  backdrop-filter: blur(10px);
}

.tip-icon {
  font-size: 16px;
  margin-right: 8px;
}

.tip-text {
  font-size: 12px;
  flex: 1;
}

/* 导航栏操作 */
.header-actions {
  display: flex;
  align-items: center;
}

.notification-btn,
.settings-btn {
  font-size: 20px;
  margin-left: 16px;
  cursor: pointer;
}
</style>
