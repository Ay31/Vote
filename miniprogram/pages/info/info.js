// miniprogram/pages/info/info.js

const app = getApp();
const db = wx.cloud.database();
const vote = db.collection('vote');

Page({
  data: {
    openId: '',
    voteData: {},
    userInfo: {},
    hasUserInfo: false
  },

  onLoad: async function () {
    await this.getOpenId();
    this.getVoteList();
  },

  onShow() {
    this.bindUserInfo();
  },

  // 绑定用户信息
  bindUserInfo() {
    const self = this;
    wx.getUserInfo({
      success: function (res) {
        self.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
    console.log('bindUserInfo');
  },

  // 获取投票列表
  getVoteList: async function () {
    const res = await vote.where({
      _openid: this.data.openId
    }).get();
    this.setData({
      voteData: res.data
    });
    console.log('getVoteList');
  },

  // 获取用户openId
  getOpenId: async function () {
    const res = await wx.cloud.callFunction({
      name: 'login'
    });
    this.setData({
      openId: res.result.openId
    })
    console.log('getOpenId');
    return new Promise((res) => res());
  },

  // 分享投票
  onShareAppMessage(res) {
    console.log(res);
    return {
      title: res.target.dataset.title,
      imageUrl: res.target.dataset.img[0],
      path: `/pages/detail/detail?voteId=${res.target.dataset.voteId}`,
    };
  },

  // 跳转至投票页
  targetToDetail(res) {
    console.log(res);
    wx.navigateTo({
      url: `/pages/detail/detail?voteId=${res.currentTarget.dataset.id}`
    });
  },

});