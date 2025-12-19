<template>
  <view class="custom-header" :style="{ paddingTop: statusBarHeight + 'px' }">
    <view class="header-content">
      <view class="header-left">
        <slot name="left">
          <text class="back-btn" v-if="showBack" @tap="handleBack">←</text>
        </slot>
      </view>
      
      <view class="header-title">
        <text>{{ title }}</text>
      </view>
      
      <view class="header-right">
        <slot name="right"></slot>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CustomHeader',
  props: {
    title: {
      type: String,
      default: '智慧党建'
    },
    showBack: {
      type: Boolean,
      default: false
    },
    showHome: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      statusBarHeight: 0
    }
  },
  mounted() {
    this.getStatusBarHeight()
  },
  methods: {
    getStatusBarHeight() {
      try {
        const systemInfo = uni.getSystemInfoSync()
        this.statusBarHeight = systemInfo.statusBarHeight || 0
      } catch (error) {
        console.error('获取状态栏高度失败:', error)
        this.statusBarHeight = 0
      }
    },
    
    handleBack() {
      // 检查是否有历史页面
      const pages = getCurrentPages()
      if (pages.length > 1) {
        uni.navigateBack({
          delta: 1
        })
      } else {
        // 如果没有历史页面，跳转到首页
        uni.switchTab({
          url: '/pages/index/index'
        })
      }
    }
  }
}
</script>

<style scoped>
.custom-header {
  background: linear-gradient(135deg, #C62E2E 0%, #A62626 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.header-left,
.header-right {
  min-width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.back-btn {
  font-size: 18px;
  color: white;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.back-btn:active {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
