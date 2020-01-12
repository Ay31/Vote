// miniprogram/pages/detail/detail.js
const app = getApp();
const db = wx.cloud.database();
const vote = db.collection("vote");
const _ = db.command;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    voteData: {},
    swiperList: [],
    ratioList: [],
    voteId: "",
    afterVote: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
  },

  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    });
  },

  handleVote(data) {
    const option = `voteOptionList[${data.currentTarget.dataset.index}]`;
    vote
      .doc(this.data.voteId)
      .update({
        data: {
          voteOptionList: {
            [data.currentTarget.dataset.index]: {
              count: _.inc(1)
            }
          }
        }
      })
      .then(data => {
        this.getRetio();
        this.setData({
          afterVote: true
        });
        console.log(data);
      });
  },

  getRetio: async function() {
    const data = await wx.cloud.callFunction({
      name: "ratio",
      data: {
        voteId: this.data.voteId
      }
    });
    this.setData({
      ratioList: data.result.ratioList
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
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
