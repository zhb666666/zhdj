<template>
  <view class="opinions-container">
    <!-- 自定义导航栏 -->
    <custom-header title="意见稿管理">
      <template v-slot:right>
        <view class="header-actions">
          <text class="search-btn" @tap="toggleSearch">🔍</text>
          <text v-if="canCreate" class="add-btn" @tap="showAddOpinion">➕</text>
          <text class="filter-btn" @tap="showFilter">📊</text>
        </view>
      </template>
    </custom-header>
    
    <!-- 搜索栏 -->
    <view v-if="showSearchBar" class="search-bar">
      <view class="search-input-wrapper">
        <input 
          class="search-input" 
          v-model="searchQuery"
          placeholder="搜索意见主题或内容"
          @input="onSearchInput"
        />
        <text class="search-clear" v-if="searchQuery" @tap="clearSearch">✖</text>
      </view>
    </view>
    
    <!-- 筛选条件 -->
    <view v-if="showFilterBar" class="filter-bar">
      <scroll-view class="filter-scroll" scroll-x="true">
        <view class="filter-chips">
          <view 
            class="filter-chip" 
            :class="{ active: selectedFilter === 'all' }"
            @tap="setFilter('all')"
          >
            全部
          </view>
          <view 
            class="filter-chip" 
            :class="{ active: selectedFilter === 'my' }"
            @tap="setFilter('my')"
          >
            我的意见
          </view>
          <view 
            class="filter-chip" 
            :class="{ active: selectedFilter === 'recent' }"
            @tap="setFilter('recent')"
          >
            最近提交
          </view>
        </view>
      </scroll-view>
    </view>
    
    <!-- 加载状态 -->
    <view v-if="loading" class="loading">
      <view class="loading-spinner"></view>
      <text>加载中...</text>
    </view>
    
    <!-- 意见稿列表 -->
    <view v-else class="opinions-list">
      <view 
        v-for="opinion in filteredOpinions" 
        :key="opinion.id"
        class="opinion-item"
        @tap="viewOpinionDetail(opinion)"
      >
        <view class="opinion-header">
          <text class="opinion-subject">{{ opinion.subject }}</text>
          <view class="opinion-status">
            <text class="status-badge" :class="opinion.status">{{ getStatusName(opinion.status) }}</text>
          </view>
        </view>
        
        <view class="opinion-content">
          <text class="opinion-text">{{ truncateText(opinion.content, 100) }}</text>
        </view>
        
        <view class="opinion-meta">
          <view class="meta-left">
            <text class="submitter">{{ opinion.submitterName }}</text>
            <text class="phone">{{ maskPhone(opinion.phone) }}</text>
          </view>
          <view class="meta-right">
            <text class="submit-time">{{ formatTime(opinion.submitTime) }}</text>
          </view>
        </view>
        
        <view v-if="opinion.attachments && opinion.attachments.length > 0" class="opinion-attachments">
          <text class="attachment-icon">📎</text>
          <text class="attachment-count">{{ opinion.attachments.length }} 个附件</text>
        </view>
        
        <view class="opinion-actions">
          <text v-if="canManage" class="action-btn" @tap.stop="editOpinion(opinion)">编辑</text>
          <text v-if="canDelete(opinion)" class="action-btn delete" @tap.stop="deleteOpinion(opinion)">删除</text>
          <text class="action-btn" @tap.stop="viewOpinion(opinion)">查看</text>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view v-if="filteredOpinions.length === 0" class="empty-state">
        <text class="empty-icon">💭</text>
        <text class="empty-text">
          {{ searchQuery ? '未找到匹配的意见稿' : '暂无意见稿数据' }}
        </text>
        <text v-if="!searchQuery && canCreate" class="empty-action" @tap="showAddOpinion">
          立即提交意见
        </text>
      </view>
    </view>
    
    <!-- 浮动操作按钮 -->
    <view v-if="canCreate && !showSearchBar" class="fab" @tap="showAddOpinion">
      <text class="fab-icon">➕</text>
    </view>
    
    <!-- 底部统计 -->
    <view class="stats-summary">
      <text class="stats-text">
        共 {{ filteredOpinions.length }} 条意见稿
        <text v-if="stats.pendingCount > 0">，待处理 {{ stats.pendingCount }} 条</text>
      </text>
    </view>
  </view>
</template>

<script>
const DataEncryption = require('../../utils/security/data-encryption.js')
const AuthService = require('../../utils/api/auth.js')
const AuditLogger = require('../../utils/security/audit-logger.js')

export default {
  name: 'Opinions',
  data() {
    return {
      loading: true,
      opinions: [],
      filteredOpinions: [],
      searchQuery: '',
      selectedFilter: 'all',
      showSearchBar: false,
      showFilterBar: false,
      stats: {
        total: 0,
        pendingCount: 0,
        myCount: 0
      }
    }
  },
  computed: {
    canCreate() {
      return AuthService.hasPermission('opinion:create')
    },
    canManage() {
      return AuthService.hasPermission('opinion:manage')
    },
    currentUserId() {
      const userInfo = AuthService.getUserInfo()
      return userInfo ? userInfo.id : null
    }
  },
  onLoad() {
    this.loadOpinions()
  },
  onShow() {
    // 页面显示时刷新数据
    if (!this.loading) {
      this.loadOpinions()
    }
  },
  onPullDownRefresh() {
    this.loadOpinions()
  },
  methods: {
    // 加载意见稿列表
    async loadOpinions() {
      try {
        this.loading = true
        
        const request = require('../../utils/api/request.js')
        const params = {
          organizationId: AuthService.getCurrentOrganizationId(),
          page: 1,
          size: 100
        }
        
        // 如果不是管理员，只能查看自己的意见或公开的意见
        if (!this.canManage) {
          params.submitterId = this.currentUserId
        }
        
        const response = await request.get('/api/opinions/list', params)
        
        if (response.success) {
          const opinions = response.data.list || []
          
          // 数据脱敏处理（隐藏他人敏感信息）
          const processedOpinions = opinions.map(opinion => {
            if (!this.canManage && opinion.submitterId !== this.currentUserId) {
              return {
                ...opinion,
                phone: DataEncryption.maskPhone(opinion.phone)
              }
            }
            return opinion
          })
          
          this.opinions = processedOpinions
          this.filteredOpinions = processedOpinions
          this.calculateStats()
          
          // 记录审计日志
          AuditLogger.logDataAccess('opinion', 'list', null)
        }
      } catch (error) {
        console.error('加载意见稿列表失败:', error)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
        uni.stopPullDownRefresh()
      }
    },
    
    // 计算统计信息
    calculateStats() {
      const total = this.opinions.length
      const pendingCount = this.opinions.filter(o => o.status === 'pending').length
      const myCount = this.opinions.filter(o => o.submitterId === this.currentUserId).length
      
      this.stats = { total, pendingCount, myCount }
    },
    
    // 筛选意见稿
    filterOpinions() {
      let filtered = [...this.opinions]
      
      // 搜索过滤
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(opinion => 
          opinion.subject.toLowerCase().includes(query) ||
          opinion.content.toLowerCase().includes(query)
        )
      }
      
      // 分类过滤
      switch (this.selectedFilter) {
        case 'my':
          filtered = filtered.filter(opinion => opinion.submitterId === this.currentUserId)
          break
        case 'recent':
          const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000)
          filtered = filtered.filter(opinion => new Date(opinion.submitTime).getTime() >= threeDaysAgo)
          break
      }
      
      this.filteredOpinions = filtered
    },
    
    // 搜索输入处理
    onSearchInput() {
      this.filterOpinions()
    },
    
    // 清除搜索
    clearSearch() {
      this.searchQuery = ''
      this.filterOpinions()
    },
    
    // 切换搜索栏
    toggleSearch() {
      this.showSearchBar = !this.showSearchBar
      if (!this.showSearchBar) {
        this.clearSearch()
      }
    },
    
    // 显示筛选栏
    showFilter() {
      this.showFilterBar = !this.showFilterBar
    },
    
    // 设置筛选条件
    setFilter(filter) {
      this.selectedFilter = filter
      this.filterOpinions()
    },
    
    // 获取状态名称
    getStatusName(status) {
      const statusNames = {
        'pending': '待处理',
        'processing': '处理中',
        'resolved': '已解决',
        'rejected': '已拒绝'
      }
      return statusNames[status] || '未知'
    },
    
    // 截断文本
    truncateText(text, maxLength) {
      if (!text) return ''
      if (text.length <= maxLength) return text
      return text.substring(0, maxLength) + '...'
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
    
    // 手机号脱敏
    maskPhone(phone) {
      return DataEncryption.maskPhone(phone)
    },
    
    // 查看意见稿详情
    viewOpinionDetail(opinion) {
      uni.navigateTo({
        url: `/pages/opinions/detail?id=${opinion.id}`
      })
      
      // 记录审计日志
      AuditLogger.logDataAccess('opinion', 'view', opinion.id)
    },
    
    // 编辑意见稿
    editOpinion(opinion) {
      // 检查权限
      if (!this.canManage && opinion.submitterId !== this.currentUserId) {
        uni.showToast({
          title: '无权编辑该意见稿',
          icon: 'none'
        })
        return
      }
      
      uni.navigateTo({
        url: `/pages/opinions/edit?id=${opinion.id}`
      })
    },
    
    // 查看意见稿
    viewOpinion(opinion) {
      this.viewOpinionDetail(opinion)
    },
    
    // 删除意见稿
    deleteOpinion(opinion) {
      // 检查权限
      if (!this.canManage && opinion.submitterId !== this.currentUserId) {
        uni.showToast({
          title: '无权删除该意见稿',
          icon: 'none'
        })
        return
      }
      
      uni.showModal({
        title: '确认删除',
        content: '确定要删除这条意见稿吗？此操作不可恢复。',
        success: async (res) => {
          if (res.confirm) {
            try {
              const request = require('../../utils/api/request.js')
              const response = await request.delete(`/api/opinions/${opinion.id}`)
              
              if (response.success) {
                uni.showToast({
                  title: '删除成功',
                  icon: 'success'
                })
                
                // 记录审计日志
                AuditLogger.logDataModification('opinion', 'delete', opinion.id, opinion, null)
                
                // 刷新列表
                this.loadOpinions()
              } else {
                uni.showToast({
                  title: response.message || '删除失败',
                  icon: 'none'
                })
              }
            } catch (error) {
              console.error('删除意见稿失败:', error)
              uni.showToast({
                title: '删除失败',
                icon: 'none'
              })
            }
          }
        }
      })
    },
    
    // 检查是否可以删除
    canDelete(opinion) {
      return this.canManage || opinion.submitterId === this.currentUserId
    },
    
    // 显示添加意见稿
    showAddOpinion() {
      uni.navigateTo({
        url: '/pages/opinions/add'
      })
    }
  },
  watch: {
    searchQuery() {
      this.filterOpinions()
    },
    selectedFilter() {
      this.filterOpinions()
    }
  }
}
</script>

<style scoped>
.opinions-container {
  min-height: 100vh;
  background-color: #F8F8F8;
}

/* 导航栏操作 */
.header-actions {
  display: flex;
  align-items: center;
}

.search-btn,
.add-btn,
.filter-btn {
  font-size: 18px;
  margin-left: 16px;
  cursor: pointer;
}

/* 搜索栏 */
.search-bar {
  background-color: white;
  padding: 12px 16px;
  border-bottom: 1px solid #F0F0F0;
}

.search-input-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 10px 40px 10px 12px;
  border: 1px solid #DDD;
  border-radius: 20px;
  font-size: 14px;
  background-color: #F8F8F8;
}

.search-clear {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #999;
  cursor: pointer;
}

/* 筛选栏 */
.filter-bar {
  background-color: white;
  padding: 8px 0;
  border-bottom: 1px solid #F0F0F0;
}

.filter-scroll {
  white-space: nowrap;
}

.filter-chips {
  display: flex;
  padding: 0 16px;
}

.filter-chip {
  padding: 6px 16px;
  margin-right: 8px;
  background-color: #F5F5F5;
  color: #666;
  border-radius: 16px;
  font-size: 12px;
  white-space: nowrap;
  transition: all 0.2s;
}

.filter-chip.active {
  background-color: #C62E2E;
  color: white;
}

/* 意见稿列表 */
.opinions-list {
  padding: 16px;
}

.opinion-item {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.opinion-item:active {
  transform: scale(0.98);
}

.opinion-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.opinion-subject {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  flex: 1;
  margin-right: 8px;
  line-height: 1.4;
}

.opinion-status {
  flex-shrink: 0;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
}

.status-badge.pending {
  background-color: #FFF3E0;
  color: #FF9800;
}

.status-badge.processing {
  background-color: #E3F2FD;
  color: #2196F3;
}

.status-badge.resolved {
  background-color: #E8F5E8;
  color: #4CAF50;
}

.status-badge.rejected {
  background-color: #FFEBEE;
  color: #F44336;
}

.opinion-content {
  margin-bottom: 12px;
}

.opinion-text {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.opinion-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.meta-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.submitter {
  font-size: 12px;
  color: #333;
  font-weight: 500;
}

.phone {
  font-size: 12px;
  color: #999;
}

.meta-right {
  text-align: right;
}

.submit-time {
  font-size: 12px;
  color: #999;
}

.opinion-attachments {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
  padding: 6px 12px;
  background-color: #F5F5F5;
  border-radius: 6px;
}

.attachment-icon {
  font-size: 12px;
}

.attachment-count {
  font-size: 12px;
  color: #666;
}

.opinion-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.action-btn {
  padding: 4px 12px;
  border: 1px solid #C62E2E;
  color: #C62E2E;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:active {
  background-color: #C62E2E;
  color: white;
}

.action-btn.delete {
  border-color: #F44336;
  color: #F44336;
}

.action-btn.delete:active {
  background-color: #F44336;
  color: white;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-icon {
  display: block;
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  display: block;
  font-size: 16px;
  margin-bottom: 20px;
}

.empty-action {
  display: inline-block;
  padding: 12px 24px;
  background-color: #C62E2E;
  color: white;
  border-radius: 6px;
  font-size: 14px;
}

/* 浮动操作按钮 */
.fab {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  background-color: #C62E2E;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(198, 46, 46, 0.3);
  z-index: 100;
}

.fab-icon {
  font-size: 24px;
  color: white;
}

/* 统计信息 */
.stats-summary {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.95);
  padding: 12px 16px;
  border-top: 1px solid #F0F0F0;
  backdrop-filter: blur(10px);
}

.stats-text {
  font-size: 12px;
  color: #666;
  text-align: center;
}
</style>
