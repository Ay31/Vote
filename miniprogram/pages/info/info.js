// miniprogram/pages/info/info.js
import { getVoteList } from '../../common/api'

const app = getApp()

Page({
  data: {
    voteData: {},
  },

  onLoad: async function() {
    this.getVoteList()
  },

  // 获取投票列表
  getVoteList: async function() {
    try {
      const res = await getVoteList({
        openId: app.globalData.openId,
      })
      this.setData({
        voteData: res.data.voteList,
      })
    } catch (error) {
      console.error(error)
    }
    console.log('getVoteList')
  },

  // 分享投票
  onShareAppMessage(res) {
    console.log(res)
    return {
      title: res.target.dataset.title,
      // imageUrl: res.target.dataset.img[0] ? res.target.dataset.img[0] : '',
      path: `/pages/detail/detail?voteId=${res.target.dataset.voteId}`,
    }
  },

  // 跳转至投票页
  targetToDetail(res) {
    console.log(res)
    wx.navigateTo({
      url: `/pages/detail/detail?voteId=${res.currentTarget.dataset.id}`,
    })
  },
})
