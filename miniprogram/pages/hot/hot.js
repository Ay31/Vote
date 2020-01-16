// miniprogram/pages/hot/hot.js
Page({
  data: {
    openId: '',
    voteData: {},
    userInfo: {},
    hasUserInfo: false
  },

  onLoad() {
    this.getPublicVote()
  },

  async getPublicVote() {
    const res = await wx.cloud.callFunction({
      name: 'getPublicVote'
    })
    this.setData({
      voteData: res.result.data
    })
    console.log(res)
  }
})
