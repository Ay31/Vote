// miniprogram/pages/hot/hot.js
import { getHotVoteList, submitVote } from '../../common/api'

const app = getApp()

Page({
  data: {
    openId: '',
    voteData: {},
    voteDataArr: [],
    index: 1,
    userInfo: {},
    votedColor: ['#9dc8c8', '#58c9b9', '#519d9e', '#d1b6e1'],
  },

  async onLoad() {
    // this.getPublicVote()
    const res = await getHotVoteList({
      openId: app.globalData.openId,
    })
    for (let i = 0; i < res.data.voteList.length; i += 10) {
      this.data.voteDataArr.push(res.data.voteList.slice(i, i + 10))
    }
    this.setData({
      voteData: this.data.voteDataArr[0],
    })
  },

  // 上拉刷新
  onReachBottom: function () {
    if (this.data.index < this.data.voteDataArr.length) {
      this.setData({
        voteData: this.data.voteData.concat(this.data.voteDataArr[1]),
      })
      this.data.index++
    } else {
      wx.showToast({
        title: '已经到底了',
        icon: 'none',
        duration: 1500,
        mask: true,
      })
    }
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

  // 预览图片
  ViewImage(e) {
    wx.previewImage({
      urls: e.currentTarget.dataset.urls,
      current: e.currentTarget.dataset.url,
    })
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
