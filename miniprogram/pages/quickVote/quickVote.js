// miniprogram/pages/quickVote/quickVote.js

const app = getApp();
const db = wx.cloud.database();
const vote = db.collection("vote");

Page({
  data: {
    newVoteTitle: "",
    voteType: "private",
    isPrivate: true,
    voteOptionList: [
      {
        content: "YES",
        count: 0
      },
      {
        content: "NO",
        count: 0
      }
    ]
  },

  // 提交投票
  postVote: async function() {
    const self = this;
    const createTime = Date.parse(new Date());
    const res = await vote.add({
      data: {
        voteTitle: self.data.newVoteTitle,
        isPrivate: self.data.isPrivate,
        voteOptionList: self.data.voteOptionList,
        createTime,
        endingTime: createTime + self.data.enableTime * 86400000
      }
    });
    wx.redirectTo({
      url: `/pages/detail/detail?voteId=${res._id}`
    });
  },

  //投票标题
  bindTitleInput(e) {
    this.setData({
      newVoteTitle: e.detail.value
    });
  },

  //添加投票选项
  addVoteOption() {
    this.data.voteOptionList.push({
      content: ""
    });
    this.setData({
      voteOptionList: this.data.voteOptionList
    });
  },

  //删除投票选项
  deleteVoteOption(e) {
    console.log(this.data.voteOptionList.length);
    if (this.data.voteOptionList.length <= 2) {
      wx.showToast({
        title: "选项至少为2项",
        icon: "none",
        duration: 1000
      });
    } else {
      const index = e.currentTarget.dataset.index;
      this.data.voteOptionList.splice(index, 1);
      this.setData({
        voteOptionList: this.data.voteOptionList
      });
    }
  },

  //选项内容输入
  bindVoteInput(e) {
    const index = e.currentTarget.dataset.index;
    this.data.voteOptionList[index].content = e.detail.value;
    this.setData({
      voteOptionList: this.data.voteOptionList
    });
  },

  //投票类型
  radioChange(e) {
    this.setData({
      isPrivate: e.detail.value === "私密" ? true : false
    });
  }
});
