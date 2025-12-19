import AuthService from '../../services/auth.service';

Page({
  data: {
    userInfo: null,
    role: null,
    statistics: {
      enterpriseCount: 0,
      organizationCount: 0,
      memberCount: 0,
      gridCount: 0
    },
    newsList: [],
    quickActions: []
  },

  onLoad() {
    this.checkLogin();
    this.loadUserInfo();
    this.loadStatistics();
    this.loadNews();
    this.setupQuickActions();
  },

  onShow() {
    this.loadUserInfo();
  },

  checkLogin() {
    const app = getApp();
    if (!app.globalData.token) {
      wx.reLaunch({
        url: '/pages/login/login'
      });
    }
  },

  loadUserInfo() {
    const app = getApp();
    this.setData({
      userInfo: app.globalData.userInfo,
      role: app.globalData.role
    });
  },

  async loadStatistics() {
    const app = getApp();
    const securityManager = app.globalData.securityManager;

    if (securityManager.validatePermission(app.globalData.role, 'view_statistics')) {
      this.setData({
        statistics: {
          enterpriseCount: 156,
          organizationCount: 45,
          memberCount: 1289,
          gridCount: 12
        }
      });
    }
  },

  async loadNews() {
    this.setData({
      newsList: [
        {
          id: 1,
          title: '学习贯彻党的二十大精神',
          date: '2024-01-15',
          isCarousel: true
        },
        {
          id: 2,
          title: '园区党建工作表彰大会召开',
          date: '2024-01-10',
          isCarousel: true
        },
        {
          id: 3,
          title: '加强基层党组织建设座谈会',
          date: '2024-01-08',
          isCarousel: false
        }
      ]
    });
  },

  setupQuickActions() {
    const app = getApp();
    const role = app.globalData.role;
    let actions = [];

    if (role === 'admin' || role === 'park_manager') {
      actions = [
        { icon: '📝', title: '意见稿管理', url: '/pages/park/opinions/list' },
        { icon: '📰', title: '党建资讯', url: '/pages/park/news/list' },
        { icon: '👥', title: '党员管理', url: '/pages/park/members/list' },
        { icon: '🏢', title: '组织架构', url: '/pages/park/organization/list' },
        { icon: '📊', title: '数据统计', url: '/pages/park/statistics/analysis' },
        { icon: '📢', title: '通知公告', url: '/pages/park/announcements/list' }
      ];
    } else if (role === 'enterprise_manager') {
      actions = [
        { icon: '📝', title: '提交意见', url: '/pages/enterprise/opinions/submit' },
        { icon: '📋', title: '我的意见', url: '/pages/enterprise/opinions/list' },
        { icon: '📢', title: '通知公告', url: '/pages/enterprise/announcements/list' },
        { icon: '👥', title: '党员管理', url: '/pages/park/members/list' }
      ];
    } else {
      actions = [
        { icon: '📝', title: '提交意见', url: '/pages/enterprise/opinions/submit' },
        { icon: '📰', title: '党建资讯', url: '/pages/park/news/list' },
        { icon: '📢', title: '通知公告', url: '/pages/enterprise/announcements/list' }
      ];
    }

    this.setData({ quickActions: actions });
  },

  onNewsClick(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/park/news/detail?id=${id}`
    });
  },

  onActionClick(e) {
    const { url } = e.currentTarget.dataset;
    if (url.includes('list') || url.includes('analysis')) {
      wx.navigateTo({ url });
    } else {
      wx.navigateTo({ url });
    }
  },

  async onLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: async (res) => {
        if (res.confirm) {
          await AuthService.logout();
        }
      }
    });
  },

  onSecurityCheck() {
    const app = getApp();
    const securityManager = app.globalData.securityManager;
    
    wx.showLoading({ title: '检查中...' });
    
    setTimeout(() => {
      const result = securityManager.performSecurityCheck();
      wx.hideLoading();
      
      if (result.passed) {
        wx.showToast({
          title: '安全检查通过',
          icon: 'success'
        });
      } else {
        wx.showModal({
          title: '安全检查',
          content: '部分安全检查未通过，请检查系统设置',
          showCancel: false
        });
      }
    }, 1000);
  }
});
