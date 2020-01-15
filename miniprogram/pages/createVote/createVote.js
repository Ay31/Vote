// miniprogram/pages/vote/vote.js
const app = getApp();
const db = wx.cloud.database();
const vote = db.collection("vote");

Page({
  data: {
    newVoteTitle: "",
    desTextareaData: "",
    isPrivate: true,
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
    const createTime = Date.parse(new Date());
    await this.postImage()
    const res = await vote.add({
      data: {
        voteTitle: self.data.newVoteTitle,
        desTextareaData: self.data.desTextareaData,
        voteOptionList: self.data.voteOptionList,
        imgIdList: self.data.imgIdList,
        isPrivate: self.data.isPrivate,
        enable: true,
        createTime,
        endingTime: createTime + self.data.enableTime * 86400000
      }
    })
    wx.redirectTo({
      url: `/pages/detail/detail?voteId=${res._id}`
    });
  },

  // 上传图片
  postImage() {
    return new Promise(async resolve => {
      let arr = [];
      this.data.imgList.forEach((tmpUrl, index) => {
        arr[index] = new Promise(async resolve => {
          const tmp = tmpUrl.split("/");
          const name = tmp[tmp.length - 1];
          const path = `images/${name}`;
          const res = await wx.cloud
            .uploadFile({
              cloudPath: path,
              filePath: tmpUrl
            })
          this.data.imgIdList.push(res.fileID);
          resolve();
        });
      });
      await Promise.all(arr)
      this.setData({
        imgIdList: this.data.imgIdList
      });
      resolve();
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
      title: "确认删除",
      content: "确定要删除该照片吗？",
      cancelText: "取消",
      confirmText: "删除",
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
      count: 4,
      sizeType: ["original", "compressed"],
      sourceType: ["album"],
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
      const index = e.currentTarget.dataset.index;
      this.data.voteOptionList.splice(index, 1);
      this.setData({
        voteOptionList: this.data.voteOptionList
      });
    }
  },

  // 选项内容输入
  bindVoteInput(e) {
    const index = e.currentTarget.dataset.index;
    this.data.voteOptionList[index].content = e.detail.value;
    this.setData({
      voteOptionList: this.data.voteOptionList
    });
  },

  // 投票类型
  radioChange(e) {
    this.setData({
      isPrivate: e.detail.value === "私密" ? true : false
    });
  },

  // 更改生效时间
  changeEnableTime(e) {
    this.setData({
      enableTime: e.detail.value
    })
  },

});