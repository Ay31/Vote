// miniprogram/pages/login/login.js
const app = getApp();
const db = wx.cloud.database();
const info = db.collection("info");

Page({
  data: {
    userInfo: {},
    openId: "",
    hasUserInfo: false,
    target: ""
  },
  onLoad: async function (options) {
    console.log(options);
    this.setData({
      target: options.target
    });
  },

  getUserInfo(e) {
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo;
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      });
      console.log("getUserInfo");
      console.log(this.data.userInfo);
      if (this.data.hasUserInfo) {
        wx.redirectTo({
          url: `/pages/${this.data.target}/${this.data.target}`,
          success(data) {
            console.log(data);
          }
        });
      }
    } else {
      wx.showModal({
        title: "警告",
        content: "您点击了拒绝授权，将无法进入小程序，请授权之后再进入",
        showCancel: false,
        confirmText: "返回授权"
      });
    }
  }
});