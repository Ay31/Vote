// miniprogram/pages/detail/detail.js
const app = getApp();
const db = wx.cloud.database();
const vote = db.collection("vote");
const info = db.collection("info");
const _ = db.command;

Page({
  data: {
    voteData: {},
    swiperList: [],
    ratioList: [],
    userInfo: {},
    voteId: "",
    openId: "",
    hasUserInfo: false,
    beforeVote: true,
    enableTime: true,
  },

  onLoad(options) {
    this.getVoteData(options.voteId);
    this.getOpenId().then(() => {
      this.confirmEnableTime();
      this.confirmUserInfo();
      this.getRetio();
    });
    this.bindUserInfo();
  },

  // 轮播
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    });
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

  // 用户授权
  getUserInfo(e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      console.log('getUserInfo');
      console.log(this.data.userInfo);
    } else {
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入',
        showCancel: false,
        confirmText: '返回授权',
      })
    }
  },

  // 获取投票数据
  getVoteData: async function (voteId) {
    const res = await vote.doc(voteId).get();
    this.setData({
      voteData: res.data,
      swiperList: res.data.imgIdList,
      voteId
    });
    console.log('getVoteData');
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

  // 响应投票
  handleVote: async function (data) {
    // const self = this;
    this.submitVote(data);
    // await info.add({
    //   data: self.data.userInfo
    // });
    this.getRetio();
    this.setData({
      beforeVote: false
    });
  },

  // 获取选项占比
  getRetio: async function () {
    const data = await wx.cloud.callFunction({
      name: "ratio",
      data: {
        voteId: this.data.voteId
      }
    });
    this.setData({
      ratioList: data.result.ratioList
    });
    console.log('getRetio');
  },

  // 提交投票
  submitVote(data) {
    wx.cloud.callFunction({
      name: "submitVote",
      data: {
        voteId: this.data.voteId,
        openId: this.data.openId,
        index: data.currentTarget.dataset.index
      }
    });
  },

  // 确认用户信息
  confirmUserInfo: async function () {
    const res = await wx.cloud.callFunction({
      name: "confirmUserInfo",
      data: {
        voteId: this.data.voteId,
        openId: this.data.openId
      }
    });
    this.setData({
      beforeVote: res.result
    });
    console.log('confirmUserInfo');
  },

  // 确认生效状态
  confirmEnableTime: async function () {
    const res = await wx.cloud.callFunction({
      name: 'confirmEnableTime',
      data: {
        voteId: this.data.voteId,
      }
    })
    this.setData({
      enableTime: res.result
    })
    console.log('confirmEnableTime');
  },
});