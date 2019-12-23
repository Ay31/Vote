// miniprogram/pages/quickVote/quickVote.js

const app = getApp();
const db = wx.cloud.database();
const vote = db.collection('vote');
const todos = db.collection('todos');

Page({

  data: {
    newVoteTitle: '',
    desTextareaData: '',
    voteType: 'private',
    imgList: [],
    voteOptionList: [{content: 'YES'}, {content: 'NO'}],
    // newVoteOption: {},
  },

  //投票标题
  bindTitleInput(e) {
    let self = this;
    self.setData({
      newVoteTitle: e.detail.value
    })
  },

  //投票描述
  bindDesTextAreaInput(e) {
    let self = this;
    self.setData({
      desTextareaData: e.detail.value
    })
  },

  postVote() {

  },

  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },

  DelImg(e) {
    wx.showModal({
      title: '召唤师',
      content: '确定要删除这段回忆吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },

  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },

  //添加投票选项
  addVoteOption() {
    let self = this;
    self.data.voteOptionList.push({
      content: ''
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
        title: '选项至少为2项',
        icon: 'none',
        duration: 1000
      });
    } else {
      let index = e.currentTarget.dataset.index;
      // console.log(index);
      let delData = self.data.voteOptionList;
      delData.splice(index, 1);
      self.setData({
        voteOptionList: delData
      })
    }
  },

  //选项内容输入
  bindVoteInput(e) {
    const self = this;
    let index = e.currentTarget.dataset.index;
    self.data.voteOptionList[index].content = e.detail.value;
    self.setData({
      voteOptionList: self.data.voteOptionList
    })
  },

  //投票类型
  radioChange(e) {
    const self = this;
    let voteType;
    if (e.detail.value === '公开') voteType = 'public'
    else voteType = 'pritvate'
    self.setData({
      voteType: voteType
    });
  }
})