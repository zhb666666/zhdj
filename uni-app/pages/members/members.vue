<template>
  <view class="members-container">
    <!-- 自定义导航栏 -->
    <custom-header title="党员管理">
      <template v-slot:right>
        <view class="header-actions">
          <text class="search-btn" @tap="toggleSearch">🔍</text>
          <text v-if="canManage" class="add-btn" @tap="showAddMember">➕</text>
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
          placeholder="搜索党员姓名、身份证号或手机号"
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
            :class="{ active: selectedFilter === 'male' }"
            @tap="setFilter('male')"
          >
            男党员
          </view>
          <view 
            class="filter-chip" 
            :class="{ active: selectedFilter === 'female' }"
            @tap="setFilter('female')"
          >
            女党员
          </view>
          <view 
            class="filter-chip" 
            :class="{ active: selectedFilter === 'young' }"
            @tap="setFilter('young')"
          >
            35岁以下
          </view>
        </view>
      </scroll-view>
    </view>
    
    <!-- 加载状态 -->
    <view v-if="loading" class="loading">
      <view class="loading-spinner"></view>
      <text>加载中...</text>
    </view>
    
    <!-- 党员列表 -->
    <view v-else class="members-list">
      <view 
        v-for="member in filteredMembers" 
        :key="member.id"
        class="member-item"
        @tap="viewMemberDetail(member)"
      >
        <view class="member-avatar">
          <image 
            :src="member.avatar || '/static/images/default-avatar.png'" 
            mode="aspectFill"
          ></image>
          <view class="member-gender" :class="member.gender">
            {{ member.gender === '男' ? '♂' : '♀' }}
          </view>
        </view>
        
        <view class="member-info">
          <view class="member-header">
            <text class="member-name">{{ member.name }}</text>
            <view class="member-badges">
              <text v-if="isYoung(member)" class="badge young">年轻</text>
              <text v-if="member.position" class="badge position">{{ member.position }}</text>
            </view>
          </view>
          
          <view class="member-details">
            <text class="member-id-card">{{ maskIdCard(member.idCard) }}</text>
            <text class="member-phone">{{ maskPhone(member.phone) }}</text>
          </view>
          
          <view class="member-org">
            <text>{{ member.organizationName || '未分配组织' }}</text>
            <text v-if="member.guideEnterprise" class="guide-enterprise">
              指导企业: {{ member.guideEnterprise }}
            </text>
          </view>
        </view>
        
        <view class="member-actions">
          <text class="action-icon" @tap.stop="callMember(member)">📞</text>
          <text v-if="canManage" class="action-icon" @tap.stop="editMember(member)">✏️</text>
          <text class="action-icon" @tap.stop="viewMember(member)">👁️</text>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view v-if="filteredMembers.length === 0" class="empty-state">
        <text class="empty-icon">👥</text>
        <text class="empty-text">
          {{ searchQuery ? '未找到匹配的党员' : '暂无党员数据' }}
        </text>
        <text v-if="!searchQuery && canManage" class="empty-action" @tap="showAddMember">
          立即添加党员
        </text>
      </view>
    </view>
    
    <!-- 浮动操作按钮 -->
    <view v-if="canManage && !showSearchBar" class="fab" @tap="showAddMember">
      <text class="fab-icon">➕</text>
    </view>
    
    <!-- 统计信息 -->
    <view class="stats-summary">
      <text class="stats-text">
        共 {{ filteredMembers.length }} 名党员
        <text v-if="stats.femaleCount > 0">，女党员 {{ stats.femaleCount }} 名</text>
        <text v-if="stats.youngCount > 0">，35岁以下 {{ stats.youngCount }} 名</text>
      </text>
    </view>
  </view>
</template>

<script>
const DataEncryption = require('../../utils/security/data-encryption.js')
const AuthService = require('../../utils/api/auth.js')
const AuditLogger = require('../../utils/security/audit-logger.js')

export default {
  name: 'Members',
  data() {
    return {
      loading: true,
      members: [],
      filteredMembers: [],
      searchQuery: '',
      selectedFilter: 'all',
      showSearchBar: false,
      showFilterBar: false,
      stats: {
        total: 0,
        femaleCount: 0,
        youngCount: 0
      }
    }
  },
  computed: {
    canManage() {
      return AuthService.hasPermission('member:manage')
    },
    canViewSensitive() {
      return AuthService.hasPermission('member:view_sensitive')
    }
  },
  onLoad() {
    this.loadMembers()
  },
  onShow() {
    // 页面显示时刷新数据
    if (!this.loading) {
      this.loadMembers()
    }
  },
  onPullDownRefresh() {
    this.loadMembers()
  },
  methods: {
    // 加载党员列表
    async loadMembers() {
      try {
        this.loading = true
        
        const request = require('../../utils/api/request.js')
        const response = await request.get('/api/members/list', {
          organizationId: AuthService.getCurrentOrganizationId(),
          page: 1,
          size: 100
        })
        
        if (response.success) {
          let members = response.data.list || []
          
          // 数据脱敏处理
          members = members.map(member => {
            if (!this.canViewSensitive) {
              return DataEncryption.maskBatchData(member, ['idCard', 'phone'])
            }
            return member
          })
          
          this.members = members
          this.filteredMembers = members
          this.calculateStats()
          
          // 记录审计日志
          AuditLogger.logDataAccess('member', 'list', null)
        }
      } catch (error) {
        console.error('加载党员列表失败:', error)
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
      const total = this.members.length
      const femaleCount = this.members.filter(m => m.gender === '女').length
      const youngCount = this.members.filter(m => this.isYoung(m)).length
      
      this.stats = { total, femaleCount, youngCount }
    },
    
    // 筛选党员
    filterMembers() {
      let filtered = [...this.members]
      
      // 搜索过滤
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(member => 
          member.name.toLowerCase().includes(query) ||
          (member.idCard && member.idCard.includes(query)) ||
          (member.phone && member.phone.includes(query))
        )
      }
      
      // 分类过滤
      switch (this.selectedFilter) {
        case 'male':
          filtered = filtered.filter(member => member.gender === '男')
          break
        case 'female':
          filtered = filtered.filter(member => member.gender === '女')
          break
        case 'young':
          filtered = filtered.filter(member => this.isYoung(member))
          break
      }
      
      this.filteredMembers = filtered
    },
    
    // 搜索输入处理
    onSearchInput() {
      this.filterMembers()
    },
    
    // 清除搜索
    clearSearch() {
      this.searchQuery = ''
      this.filterMembers()
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
      this.filterMembers()
    },
    
    // 判断是否为年轻党员
    isYoung(member) {
      if (!member.idCard) return false
      const birthYear = parseInt(member.idCard.substring(6, 10))
      const currentYear = new Date().getFullYear()
      return (currentYear - birthYear) < 35
    },
    
    // 身份证号脱敏
    maskIdCard(idCard) {
      return DataEncryption.maskIdCard(idCard)
    },
    
    // 手机号脱敏
    maskPhone(phone) {
      return DataEncryption.maskPhone(phone)
    },
    
    // 查看党员详情
    viewMemberDetail(member) {
      uni.navigateTo({
        url: `/pages/members/detail?id=${member.id}`
      })
      
      // 记录审计日志
      AuditLogger.logDataAccess('member', 'view', member.id)
    },
    
    // 拨打电话
    callMember(member) {
      if (!member.phone) {
        uni.showToast({
          title: '该党员未设置手机号',
          icon: 'none'
        })
        return
      }
      
      uni.makePhoneCall({
        phoneNumber: member.phone,
        success: () => {
          // 记录审计日志
          AuditLogger.logDataAccess('member', 'call', member.id)
        },
        fail: () => {
          uni.showToast({
            title: '拨打电话失败',
            icon: 'none'
          })
        }
      })
    },
    
    // 编辑党员
    editMember(member) {
      uni.navigateTo({
        url: `/pages/members/edit?id=${member.id}`
      })
    },
    
    // 查看党员
    viewMember(member) {
      this.viewMemberDetail(member)
    },
    
    // 显示添加党员
    showAddMember() {
      uni.navigateTo({
        url: '/pages/members/add'
      })
    }
  },
  watch: {
    searchQuery() {
      this.filterMembers()
    },
    selectedFilter() {
      this.filterMembers()
    }
  }
}
</script>

<style scoped>
.members-container {
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

/* 党员列表 */
.members-list {
  padding: 16px;
}

.member-item {
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.member-item:active {
  transform: scale(0.98);
}

.member-avatar {
  position: relative;
  margin-right: 12px;
}

.member-avatar image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #C62E2E;
}

.member-gender {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: white;
}

.member-gender.male {
  background-color: #4A90E2;
}

.member-gender.female {
  background-color: #E24A8D;
}

.member-info {
  flex: 1;
  min-width: 0;
}

.member-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.member-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  flex: 1;
  margin-right: 8px;
}

.member-badges {
  display: flex;
  gap: 4px;
}

.badge {
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 500;
}

.badge.young {
  background-color: #E8F5E8;
  color: #4CAF50;
}

.badge.position {
  background-color: #E3F2FD;
  color: #2196F3;
}

.member-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 4px;
}

.member-id-card,
.member-phone {
  font-size: 12px;
  color: #666;
}

.member-org {
  font-size: 12px;
  color: #999;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.guide-enterprise {
  color: #C62E2E;
}

.member-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 12px;
}

.action-icon {
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s;
}

.action-icon:active {
  transform: scale(1.2);
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
