// miniprogram/pages/share/share.js

const app = getApp();
const db = wx.cloud.database();
const vote = db.collection('vote');

Page({

  data: {
    voteData: {}
  },

  onLoad: function (options) {
    const self = this;
    console.log(options);
    vote.where({
        _id: '7799745c5e0060060626e1b708df62ab'
        // _id: options.voteId
      })
      .get()
      .then(data => {
        self.setData({
          voteData: data.data[0]
        });
      })
      .catch(err => {
        console.error(err);
      });

  },

  click() {
    console.log(this.data.voteData);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})