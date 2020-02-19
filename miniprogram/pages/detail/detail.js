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
    console.log(app.globalData.openId)
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
        enable:
          Date.parse(res.data.voteDetail.endingTime) > Date.parse(new Date()),
        beforeVote: res.data.beforeVote,
        voteId,
      })
      console.log('getVoteData')
    } catch (error) {
      console.error(error)
    }
  },

  // 响应投票
  handleVote: async function(data) {
    this.submitVote(data)
    this.getRetio()
    this.setData({ beforeVote: false })
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
  submitVote(data) {
    submitVote({
      userInfo: app.globalData.userInfo,
      voteId: this.data.voteId,
      optionId: data.currentTarget.dataset.optionId,
      openId: this.data.openId,
    })
  },
})
