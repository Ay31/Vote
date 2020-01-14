// miniprogram/pages/vote/vote.js
const app = getApp();
const db = wx.cloud.database();
const vote = db.collection("vote");

Page({
  data: {
    newVoteTitle: "",
    desTextareaData: "",
    voteType: "private",
    enableTime: 3,
    imgList: [],
    imgIdList: [],
    voteOptionList: [{
        content: "",
        count: 0
      },
      {
        content: "",
        count: 0
      }
    ]
  },

  // 投票标题
  bindTitleInput(e) {
    this.setData({
      newVoteTitle: e.detail.value
    });
  },

  // 投票描述
  bindDesTextAreaInput(e) {
    this.setData({
      desTextareaData: e.detail.value
    });
  },

  // 提交投票
  postVote: async function () {
    let self = this;
    let isPrivate = this.data.voteType === "private" ? true : false;
    const createTime = Date.new();
    await this.postImgae().then(() => {
      vote
        .add({
          data: {
            voteTitle: self.data.newVoteTitle,
            desTextareaData: self.data.desTextareaData,
            voteOptionList: self.data.voteOptionList,
            imgIdList: self.data.imgIdList,
            isPrivate,
            createTime,
            endingTime: createTime + self.data.enableTime * 86400000000
          }
        })
        .then(data => {
          wx.redirectTo({
            url: `/pages/detail/detail?voteId=${data._id}`
          });
        });
    });
  },

  // 上传图片
  postImgae() {
    return new Promise((res, rej) => {
      let arr = [];
      this.data.imgList.forEach((tmpUrl, index) => {
        arr[index] = new Promise((res, rej) => {
          const tmp = tmpUrl.split("/");
          const name = tmp[tmp.length - 1];
          const path = `images/${name}`;
          wx.cloud
            .uploadFile({
              cloudPath: path,
              filePath: tmpUrl
            })
            .then(data => {
              this.data.imgIdList.push(data.fileID);
              res();
            });
        });
      });
      Promise.all(arr).then(() => {
        this.setData({
          imgIdList: this.data.imgIdList
        });
        res();
      });
    });
  },

  // 预览图片
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },

  // 删除图片
  DelImg(e) {
    wx.showModal({
      title: "召唤师",
      content: "确定要删除这段回忆吗？",
      cancelText: "再看看",
      confirmText: "再见",
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          });
        }
      }
    });
  },

  // 选择图片
  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album"], //从相册选择
      success: res => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          });
        } else {
          this.setData({
            imgList: res.tempFilePaths
          });
        }
      }
    });
  },

  // 添加投票选项
  addVoteOption() {
    this.data.voteOptionList.push({
      content: "",
      count: 0
    });
    this.setData({
      voteOptionList: this.data.voteOptionList
    });
  },

  // 删除投票选项
  deleteVoteOption(e) {
    console.log(this.data.voteOptionList.length);
    if (this.data.voteOptionList.length <= 2) {
      wx.showToast({
        title: "选项至少为2项",
        icon: "none",
        duration: 1000
      });
    } else {
      let index = e.currentTarget.dataset.index;
      // console.log(index);
      let delData = this.data.voteOptionList;
      delData.splice(index, 1);
      this.setData({
        voteOptionList: delData
      });
    }
  },

  // 选项内容输入
  bindVoteInput(e) {
    let index = e.currentTarget.dataset.index;
    this.data.voteOptionList[index].content = e.detail.value;
    this.setData({
      voteOptionList: this.data.voteOptionList
    });
  },

  // 投票类型
  radioChange(e) {
    let voteType;
    if (e.detail.value === "公开") voteType = "public";
    else voteType = "pritvate";
    this.setData({
      voteType: voteType
    });
  },

  changeEnableTime(e) {
    this.setData({
      enableTime: e.detail.value
    })
  }
});