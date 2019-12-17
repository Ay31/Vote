// miniprogram/pages/vote/vote.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newVoteTitle: '',
    desTextareaData: '',
    voteTypes: [
      { name: 'F', value: '公开', checked: true },
      { name: 'T', value: '私密' }
  ],
    imgList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  radioChange() {
    let self = this;
    self.setData({
      
    })
  },

  bindTitleInput(e) {
    let self = this;
    self.setData({
      newVoteTitle: e.detail.value
    })
  },

  bindDesTextAreaInput(e) {
    let self = this;
    self.setData({
      desTextareaData: e.detail.value
    })
  },

  postVote() {
    console.log(this.data.newVoteTitle);
    console.log(this.data.desTextareaData);
  },
})