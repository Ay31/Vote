//app.js
wx.cloud.init()

const info = wx.cloud.database().collection('info')

App({
  globalData: {
    // userInfo: null
    hasUserInfo: false
  },

  onLaunch: function() {
    this.getUserInfo()
  },

  getUserInfo: function() {
    var self = this
    wx.getSetting({
      success(res) {
        //判断用户是否已授权获取用户信息
        if (res.authSetting['scope.userInfo']) {
          //已授权,可以直接获取用户信息不用弹框
          self.userAuthCb()
        } else {
          //未授权
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              // 用户已经同意小程序获取用户信息
              self.userAuthCb()
            },
            fail() {
              //拒绝授权
              wx.redirectTo({
                url: '/pages/login/login'
              })
            }
          })
        }
      }
    })
  },

  userAuthCb: function() {
    let that = this
    wx.showLoading({
      title: '加载中'
    })
    wx.getUserInfo({
      success: function(res) {
        that.globalData.userInfo = res.userInfo
        that.globalData.encryptedData = res.encryptedData
        that.globalData.iv = res.iv
        console.log(res.userInfo)
        if (res.encryptedData && res.iv) {
          wx.login({
            success: function(res) {
              if (res.code) {
                console.log('ok')
                info.add({
                  data: that.globalData.userInfo
                })
              }
            }
          })
        }
      }
    })
  }
})
