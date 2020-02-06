// miniprogram/pages/newIndex/newIndex.js

const app = getApp()

Page({
  data: {
    swiperList: [
      {
        id: 0,
        type: 'image',
        url: '../../style/img/vote1.jpg'
      },
      {
        id: 1,
        type: 'image',
        url: '../../style/img/vote2.jpg'
      },
      {
        id: 2,
        type: 'image',
        url: '../../style/img/vote3.jpg'
      },
      {
        id: 3,
        type: 'image',
        url: '../../style/img/vote4.jpg'
      }
    ],
    userInfo: {},
    openId: '',
    hasUserInfo: false,
    globalData: {}
  },

  onLoad: function() {
    // 绑定信息
    this.data.globalData = app.globalData
    this.setData({
      openId: app.globalData.openId,
      userInfo: app.globalData.userInfo,
      hasUserInfo: true
    })
  },

  // 跳转至快速投票页
  targetToQuick() {
    if (!this.data.hasUserInfo) {
      wx.navigateTo({
        url: '/pages/login/login?target=quickVote'
      })
    } else {
      wx.navigateTo({
        url: '/pages/quickVote/quickVote',
        success(data) {
          console.log(data)
        }
      })
    }
  },

  // 跳转至创建投票页
  targetToAdd() {
    if (!this.data.hasUserInfo) {
      wx.navigateTo({
        url: '/pages/login/login?target=createVote'
      })
    } else {
      wx.navigateTo({
        url: '/pages/createVote/createVote',
        success(data) {
          console.log(data)
        }
      })
    }
  },

  // 跳转至创建投票页
  targetToInfo() {
    if (!this.data.hasUserInfo) {
      wx.navigateTo({
        url: '/pages/login/login?target=info'
      })
    } else {
      wx.navigateTo({
        url: '/pages/info/info',
        success(data) {
          console.log(data)
        }
      })
    }
  },

  // 轮播
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  }
})
