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
    beforeVote: true,
    canVote: true
  },

  onLoad(options) {
    const { voteId } = options;
    vote
      .doc(voteId)
      .get()
      .then(data => {
        console.log(data);
        this.setData({
          voteData: data.data,
          swiperList: data.data.imgIdList,
          voteId
        });
      });
    wx.cloud
      .callFunction({
        name: "login"
      })
      .then(data => {
        this.data.openId = data.result.openId;
        this.confirmUserInfo();
        this.getRetio();
      });
  },

  bindGetUserInfo: function(e) {
    var self = this;
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      let userInfo = e.detail.userInfo;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      console.log(this.data.openId);
      self.setData({
        userInfo
      });
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      self.setData({
        isHide: false
      });
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: "警告",
        content: "您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!",
        showCancel: false,
        confirmText: "返回授权",
        success: function(res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log("用户点击了“返回授权”");
          }
        }
      });
    }
  },

  // 轮播
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    });
  },

  // 响应投票
  handleVote: async function(data) {
    // this指向可能有错
    const self = this;
    this.submitVote(data);
    // await info.add({
    //   data: self.data.userInfo
    // });
    this.getRetio();
    this.setData({
      beforeVote: false
    });
    console.log("setData");
  },

  // 获取选项占比
  getRetio: async function() {
    // return new Promise(reslove => {
    const data = await wx.cloud.callFunction({
      name: "ratio",
      data: {
        voteId: this.data.voteId
      }
    });
    this.setData({
      ratioList: data.result.ratioList
    });
    console.log("getRetio");
    // reslove()
    // })
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
    console.log("submitVote");
  },

  // 确认用户信息
  confirmUserInfo: async function() {
    const res = await wx.cloud.callFunction({
      name: "confirmUserInfo",
      data: {
        voteId: this.data.voteId,
        openId: this.data.openId
      }
    });
    this.setData({
      canVote: res.result
    });
  }
});
