// miniprogram/pages/detail/detail.js
import { getVoteDetail, submitVote, getRetio } from '../../common/api'
const app = getApp()

Page({
  data: {
    voteData: {},
    swiperList: [],
    ratioList: [],
    userInfo: {},
    voteId: '',
    beforeVote: true,
    enable: true,
  },

  onLoad: async function(options) {
    this.setData({ voteId: options.voteId })
    this.getVoteData(options.voteId, app.globalData.openId)
    this.getRetio()
  },

  // 轮播
  cardSwiper(e) {
    this.setData({ cardCur: e.detail.current })
  },

  // 获取投票数据
  getVoteData: async function(voteId, openId) {
    try {
      const res = await getVoteDetail({ voteId, openId })
      this.setData({
        voteData: res.data.voteDetail,
        swiperList: res.data.voteDetail.imageList,
        enable: res.data.voteDetail.endingTime > Date.now(),
        beforeVote: res.data.beforeVote,
        voteId,
      })
      console.log('getVoteData')
    } catch (error) {
      console.error(error)
    }
  },

  // 获取选项占比
  getRetio: async function() {
    try {
      const res = await getRetio({ voteId: this.data.voteId })
      this.setData({ ratioList: res.data.ratioList })
    } catch (error) {
      console.log(error)
    }
  },

  // 提交投票
  async submitVote(data) {
    try {
      await submitVote({
        userInfo: app.globalData.userInfo,
        voteId: this.data.voteId,
        optionId: data.currentTarget.dataset.optionId,
        openId: app.globalData.openId,
      })
      await this.getRetio()
      this.setData({ beforeVote: false })
    } catch (error) {
      console.error(error)
    }
  },
})
