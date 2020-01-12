// miniprogram/pages/quickVote/quickVote.js

const app = getApp();
const db = wx.cloud.database();
const vote = db.collection("vote");

Page({
  data: {
    newVoteTitle: "",
    voteType: "private",
    voteOptionList: [
      { content: "YES", count: 0 },
      { content: "NO", count: 0 }
    ]
    // newVoteOption: {},
  },

  // 提交投票
  postVote: async function() {
    const self = this;
    let isPrivate = self.data.voteType === "private" ? true : false;
    vote
      .add({
        data: {
          voteTitle: self.data.newVoteTitle,
          isPrivate,
          voteOptionList: self.data.voteOptionList
        }
      })
      .then(data => {
        wx.redirectTo({
          url: `/pages/detail/detail?voteId=${data._id}`
        });
      });
  },

  //投票标题
  bindTitleInput(e) {
    let self = this;
    self.setData({
      newVoteTitle: e.detail.value
    });
  },

  //添加投票选项
  addVoteOption() {
    let self = this;
    self.data.voteOptionList.push({
      content: ""
    });
    self.setData({
      voteOptionList: self.data.voteOptionList
    });
  },

  //删除投票选项
  deleteVoteOption(e) {
    const self = this;
    console.log(self.data.voteOptionList.length);
    if (self.data.voteOptionList.length <= 2) {
      wx.showToast({
        title: "选项至少为2项",
        icon: "none",
        duration: 1000
      });
    } else {
      let index = e.currentTarget.dataset.index;
      // console.log(index);
      let delData = self.data.voteOptionList;
      delData.splice(index, 1);
      self.setData({
        voteOptionList: delData
      });
    }
  },

  //选项内容输入
  bindVoteInput(e) {
    const self = this;
    let index = e.currentTarget.dataset.index;
    self.data.voteOptionList[index].content = e.detail.value;
    self.setData({
      voteOptionList: self.data.voteOptionList
    });
  },

  //投票类型
  radioChange(e) {
    const self = this;
    let voteType;
    if (e.detail.value === "公开") voteType = "public";
    else voteType = "pritvate";
    self.setData({
      voteType: voteType
    });
  }
});
