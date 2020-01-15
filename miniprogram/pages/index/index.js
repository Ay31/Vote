//index.js
const app = getApp();
const db = wx.cloud.database();
const info = db.collection('info');

Page({
  data: {
    userInfo: {},
    openId: '',
    hasUserInfo: false
  },

  onLoad: function () {
    this.getOpenId();
    this.bindUserInfo();
  },

  // 绑定用户信息
  bindUserInfo() {
    const self = this;
    wx.getUserInfo({
      success: function (res) {
        self.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
    console.log('bindUserInfo');
  },

  // 用户授权
  getUserInfo(e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      console.log('getUserInfo');
      console.log(this.data.userInfo);
    } else {
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入',
        showCancel: false,
        confirmText: '返回授权',
      })
    }
  },


  // 获取用户openId
  getOpenId: async function () {
    const res = await wx.cloud.callFunction({
      name: 'login'
    });
    this.setData({
      openId: res.result.openId
    })
    console.log('getOpenId');
    return new Promise((res) => res());
  },

  // 跳转至快速投票页
  targetToQuick() {
    wx.navigateTo({
      url: '/pages/quickVote/quickVote',
      success(data) {
        console.log(data);
      },
    })
  },

  // 跳转至创建投票页
  targetToAdd() {
    wx.navigateTo({
      url: `/pages/vote/vote?`,
      success(data) {
        console.log(data);
      },
    })
  },
})