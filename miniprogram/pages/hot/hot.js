// miniprogram/pages/hot/hot.js
import { getHotVoteList } from '../../common/api'

const app = getApp()

Page({
  data: {
    openId: '',
    voteData: {},
    userInfo: {},
    votedColor: ['#9dc8c8', '#58c9b9', '#519d9e', '#d1b6e1'],
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

  // 响应投票
  handleVote: async function(data) {
    const { index } = data.currentTarget.dataset
    console.log(data)
    console.log('tap')
    console.log(index)
    this.setData({
      ['voteData[' + index + '].beforeVote']: false,
    })
    // this.submitVote(data)
    // this.getRetio()
  },

  // 提交投票
  submitVote(data) {
    submitVote({
      userInfo: app.globalData.userInfo,
      voteId: this.data.voteId,
      optionId: data.currentTarget.dataset.optionId,
      openId: app.globalData.openId,
    })
  },
})
