// miniprogram/pages/info/info.js

const app = getApp();
const db = wx.cloud.database();
const vote = db.collection("vote");

Page({
  data: {
    openId: "",
    voteData: {},
    userInfo: {},
    hasUserInfo: false
  },

  onLoad: function () {
    const self = this;
    console.log(this.data.userInfo);
    this.getOpenId().then(() => {
      this.setData({
        openId: this.data.openId
      });
      vote
        .where({
          _openid: this.data.openId
        })
        .get()
        .then(data => {
          self.setData({
            voteData: data.data
          });
        });
    });
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

  getOpenId() {
    return new Promise(res => {
      wx.cloud
        .callFunction({
          name: "login"
        })
        .then(data => {
          console.log("云函数获取到的openid: ", data.result.openId);
          this.data.openId = data.result.openId;
          res();
        });
    });
  },

  onShareAppMessage(data) {
    console.log(data);
    const shareTitle = data.target.dataset.title;
    // const voteId = data.target.dataset.voteid;
    const img = data.target.dataset.img;
    return {
      title: shareTitle,
      path: `/pages/detail/detail?voteId=${data.target.dataset.data._id}`,
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    };
  },

  click(data) {
    // console.log(this.data.voteData);
    console.log(data);
  },

  targetToDetail(data) {
    console.log(data);
    wx.navigateTo({
      url: `/pages/detail/detail?voteId=${data.currentTarget.dataset.id}`
    });
  },

});