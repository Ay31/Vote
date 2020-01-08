// miniprogram/pages/info/info.js

const app = getApp();
const db = wx.cloud.database();
const vote = db.collection("vote");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    openid: "",
    voteData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const self = this;
    this.getOpenId().then(() => {
      this.setData({
        openid: this.data.openid
      });
      vote
        .where({
          _openid: this.data.openid
        })
        .get()
        .then(data => {
          self.setData({
            voteData: data.data
          });
        });
    });
  },

  getOpenId() {
    let self = this;
    return new Promise(res => {
      wx.cloud
        .callFunction({
          name: "login"
        })
        .then(data => {
          console.log("云函数获取到的openid: ", data.result.openId);
          this.data.openid = data.result.openId;
          res();
        });
    });
  },

  onShareAppMessage(data) {
    console.log(data);
    let shareTitle = data.target.dataset.title;
    let voteId = data.target.dataset.voteid;
    let img = data.target.dataset.img;
    return {
      title: shareTitle,
      path: `/pages/share/share?voteId=${voteId}`,
      success: function(res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    };
  },

  click(data) {
    const self = this;
    // console.log(self.data.voteData);
    console.log(data);
  },

  targetToDetail(data) {
    console.log(data);
    wx.navigateTo({
      url: `/pages/detail/detail?voteId=${data.currentTarget.dataset.id}`
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {}

  /**
   * 用户点击右上角分享
   */
});
