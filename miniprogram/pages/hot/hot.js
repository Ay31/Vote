// miniprogram/pages/hot/hot.js
import { getHotVoteList, submitVote } from '../../common/api'

const app = getApp()

Page({
  data: {
    openId: '',
    voteData: {},
    userInfo: {},
    votedColor: ['#9dc8c8', '#58c9b9', '#519d9e', '#d1b6e1'],
  },

  async onLoad() {
    // this.getPublicVote()
    const res = await getHotVoteList({
      openId: app.globalData.openId,
    })
    this.setData({
      voteData: res.data.voteList,
    })
  },

  // 提交投票
  async submitVote(data) {
    const { index, optionId, voteid } = data.currentTarget.dataset
    try {
      const res = await submitVote({
        userInfo: app.globalData.userInfo,
        voteId: voteid,
        optionId,
        openId: app.globalData.openId,
      })
      this.setData({
        ['voteData[' + index + '].voteData']: res.data.voteData,
        ['voteData[' + index + '].beforeVote']: false,
      })
    } catch (error) {
      console.error(error)
    }
  },

  // 分享投票
  onShareAppMessage(res) {
    console.log(res)
    return {
      title: res.target.dataset.title,
      imageUrl: res.target.dataset.img ? res.target.dataset.img : '',
      path: `/pages/vote/vote?voteId=${res.target.dataset.voteId}`,
    }
  },
  targetToVoteDetail(res) {
    wx.navigateTo({
      url: `/pages/detail/detail?voteId=${res.currentTarget.dataset.voteid}`,
    })
  },
})
