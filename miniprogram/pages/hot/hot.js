// miniprogram/pages/hot/hot.js
import { getHotVoteList } from '../../common/api'

const app = getApp()

Page({
  data: {
    openId: '',
    voteData: {},
    userInfo: {},
    hasUserInfo: false,
  },

  async onLoad() {
    wx.setNavigationBarTitle({
      title: '热门投票',
    })
    // this.getPublicVote()
    const res = await getHotVoteList({
      openId: app.globalData.openId,
    })
    this.setData({
      voteData: res.data.voteList,
    })
  },

  async getPublicVote() {
    const res = await wx.cloud.callFunction({
      name: 'getPublicVote',
    })
    this.setData({
      voteData: res.result.data,
    })
    console.log(res)
  },
})
