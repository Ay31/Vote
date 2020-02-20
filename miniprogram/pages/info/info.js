// miniprogram/pages/info/info.js
import { getVoteList, deleteVote } from '../../common/api'

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
      success: async res => {
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
