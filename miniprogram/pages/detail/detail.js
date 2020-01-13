// miniprogram/pages/detail/detail.js
const app = getApp();
const db = wx.cloud.database();
const vote = db.collection("vote");
const _ = db.command;

Page({
  data: {
    voteData: {},
    swiperList: [],
    ratioList: [],
    voteId: "",
    afterVote: false
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
  },

  // 轮播
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    });
  },

  // 投票
  handleVote: async function(data) {
    await vote.doc(this.data.voteId).update({
      data: {
        voteOptionList: {
          [data.currentTarget.dataset.index]: {
            count: _.inc(1)
          }
        }
      }
    });
    this.setData({
      afterVote: true
    });
    this.getRetio();

    console.log(this.data.ratioList);
  },

  // 获取选项占比
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
  }
});
