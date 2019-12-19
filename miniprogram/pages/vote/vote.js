// miniprogram/pages/vote/vote.js
const app = getApp();
const db = wx.cloud.database();
const vote = db.collection('vote');

Page({

  data: {
    newVoteTitle: '',
    desTextareaData: '',
    voteTypes: [{
        name: 'F',
        value: '公开',
        checked: true
      },
      {
        name: 'T',
        value: '私密'
      }
    ],
    imgList: [],
    voteOptionList: [],
    newVoteOption: {},
    testList: [1, 2, 3, 4]
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
    // vote.add({
    //     data: {
    //       newVoteTitle: this.data.newVoteTitle,
    //       desTextareaData: this.data.desTextareaData
    //     }
    //   })
    //   .then(data => console.log(data))
    console.log(this.data);
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

  addVoteOption() {
    let self = this;
    self.data.voteOptionList.push({
      content: ''
    });
    self.setData({
      voteOptionList: self.data.voteOptionList
    });
    // console.log(self.data.voteOptionList);
  },

  deleteVoteOption(e) {
    // console.log(e.currentTarget.dataset.index);
    let self = this;
    let index = e.currentTarget.dataset.index;
    console.log(index);
    // self.data.voteOptionList.splice(index, 1);
    let delData = self.data.voteOptionList;
    delData.splice(index, 1);
    self.setData({
      // voteOptionList: self.data.voteOptionList
      voteOptionList: delData
    })
  },

  bindVoteInput(e) {
    let self = this;
    let index = e.currentTarget.dataset.index;
    self.data.voteOptionList[index].content = e.detail.value;
    self.setData({
      voteOptionList: self.data.voteOptionList
    })
    // self.data.newVoteOption = e.detail.value; 
  }
})