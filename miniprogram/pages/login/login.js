import AuthService from '../../services/auth.service';

Page({
  data: {
    username: '',
    password: '',
    agreePrivacy: false,
    showPrivacyModal: false
  },

  onLoad() {
    this.checkAutoLogin();
  },

  checkAutoLogin() {
    const app = getApp();
    if (app.globalData.token && app.globalData.userInfo) {
      wx.switchTab({
        url: '/pages/index/index'
      });
    }
  },

  onUsernameInput(e) {
    this.setData({
      username: e.detail.value
    });
  },

  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    });
  },

  onAgreeChange(e) {
    this.setData({
      agreePrivacy: e.detail.value.length > 0
    });
  },

  showPrivacyPolicy() {
    this.setData({
      showPrivacyModal: true
    });
  },

  hidePrivacyModal() {
    this.setData({
      showPrivacyModal: false
    });
  },

  async onLogin() {
    const { username, password, agreePrivacy } = this.data;

    if (!username) {
      wx.showToast({
        title: '请输入用户名',
        icon: 'none'
      });
      return;
    }

    if (!password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      });
      return;
    }

    if (!agreePrivacy) {
      wx.showToast({
        title: '请先阅读并同意隐私政策',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: '登录中...' });

    const result = await AuthService.login(username, password);

    wx.hideLoading();

    if (result.success) {
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      });

      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        });
      }, 1500);
    } else {
      wx.showToast({
        title: result.error || '登录失败',
        icon: 'none',
        duration: 2000
      });
    }
  },

  async onWxLogin() {
    const { agreePrivacy } = this.data;

    if (!agreePrivacy) {
      wx.showToast({
        title: '请先阅读并同意隐私政策',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: '登录中...' });

    try {
      const loginRes = await new Promise((resolve, reject) => {
        wx.login({
          success: resolve,
          fail: reject
        });
      });

      const result = await AuthService.wxLogin(loginRes.code);

      wx.hideLoading();

      if (result.success) {
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });

        await AuthService.requestDataConsent([
          '个人基本信息',
          '党员信息',
          '组织信息'
        ]);

        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          });
        }, 1500);
      } else {
        wx.showToast({
          title: result.error || '登录失败',
          icon: 'none',
          duration: 2000
        });
      }
    } catch (error) {
      wx.hideLoading();
      console.error('微信登录失败:', error);
      wx.showToast({
        title: '登录失败',
        icon: 'none'
      });
    }
  }
});
