// miniprogram/pages/login/login.js
const app = getApp()

Page({
  data: {
    userInfo: {},
    openId: '',
    hasUserInfo: false,
    target: ''
  },
  onLoad: async function(options) {
    console.log(options)
    this.setData({
      target: options.target
    })
  },

  getUserInfo(e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      console.log('getUserInfo')
      console.log(this.data.userInfo)
      if (this.data.hasUserInfo) {
        wx.redirectTo({
          url: `/pages/${this.data.target}/${this.data.target}`,
          success(data) {
            console.log(data)
          }
        })
      }
    } else {
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入',
        showCancel: false,
        confirmText: '返回授权'
      })
    }
  },

  onGotUserInfo: function(e) {
    if (e.detail.errMsg.indexOf('ok') > -1) {
      wx.showToast({
        title: '授权成功',
        icon: 'success',
        duration: 1500,
        mask: true
      })
      wx.getSetting({
        success: function(res) {
          if (res.authSetting['scope.userInfo']) {
            wx.showToast({
              title: '授权成功',
              icon: 'success',
              duration: 1500,
              mask: true
            })
            //尝试再次登录
            wx.reLaunch({
              url: '/pages/index/index'
            })
            app.userAuthCb()
          } else {
            return
          }
        }
      })
    } else {
      wx.showToast({
        title: '授权失败',
        icon: 'none',
        duration: 1500,
        mask: true
      })
    }
  }
})
