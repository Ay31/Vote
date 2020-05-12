// miniprogram/pages/info/info.js
import { getVoteList, deleteVote } from '../../common/api'

const app = getApp()

Page({
  data: {
    nowTime: Date.now(),
    voteData: {},
    voteDataArr: [],
    index: 1,
  },

  onLoad: async function () {
    this.getVoteList()
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

  // 获取投票列表
  getVoteList: async function () {
    try {
      const res = await getVoteList({
        openId: app.globalData.openId,
      })
      for (let i = 0; i < res.data.voteList.length; i += 10) {
        this.data.voteDataArr.push(res.data.voteList.slice(i, i + 10))
      }
      this.setData({
        voteData: this.data.voteDataArr[0],
      })
    } catch (error) {
      console.error(error)
    }
    console.log('getVoteList')
  },

  // 删除投票
  async deleteVote(data) {
    const self = this
    console.log(data.target.dataset)
    const { index, voteid: voteId } = data.target.dataset
    wx.showModal({
      title: '确认删除',
      content: '确定要删除该投票吗？',
      cancelText: '取消',
      confirmText: '删除',
      success: async (res) => {
        if (res.confirm) {
          try {
            await deleteVote({
              voteId,
            })
            self.data.voteData.splice(index, 1)
            self.setData({
              voteData: self.data.voteData,
            })
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 1500,
              mask: true,
            })
          } catch (error) {
            console.error(error)
          }
        }
      },
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

  // 跳转至投票页
  targetToVote(res) {
    console.log(res)
    wx.navigateTo({
      url: `/pages/vote/vote?voteId=${res.currentTarget.dataset.id}`,
    })
  },

  // 跳转至详情页
  targetToDetail(res) {
    console.log(res)
    wx.navigateTo({
      url: `/pages/detail/detail?voteId=${res.currentTarget.dataset.id}`,
    })
  },
})
