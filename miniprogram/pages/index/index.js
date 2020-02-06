// miniprogram/pages/newIndex/newIndex.js
import { getRequest } from '../../common/util'

const app = getApp()
const db = wx.cloud.database()
const info = db.collection('info')

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
    this.getOpenId()
    this.bindUserInfo()
    this.data.globalData = app.globalData
    getRequest('http://192.168.1.105:8080/api/users/test').then(res =>
      console.log(res)
    )
  },

  // 绑定用户信息
  bindUserInfo() {
    const self = this
    wx.getUserInfo({
      success: function(res) {
        self.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
    console.log('bindUserInfo')
  },

  // 用户授权
  getUserInfo(e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      console.log('getUserInfo')
      console.log(this.data.userInfo)
    } else {
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入',
        showCancel: false,
        confirmText: '返回授权'
      })
    }
  },

  // 获取用户openId
  getOpenId: async function() {
    const res = await wx.cloud.callFunction({
      name: 'login'
    })
    this.setData({
      openId: res.result.openId
    })
    console.log('getOpenId')
    return new Promise(res => res())
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
