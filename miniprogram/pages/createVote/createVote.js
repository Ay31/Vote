// miniprogram/pages/vote/vote.js
import { createVote, uploadImage } from '../../common/api'

const app = getApp()
const db = wx.cloud.database()
const vote = db.collection('vote')

Page({
  data: {
    newVoteTitle: '',
    desTextareaData: '',
    isPrivate: true,
    enableTime: 3,
    imgList: [],
    imageList: [],
    voteOptionList: [
      {
        content: '',
        count: 0,
      },
      {
        content: '',
        count: 0,
      },
    ],
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: '创建投票',
    })
  },

  // 投票标题
  bindTitleInput(e) {
    this.setData({
      newVoteTitle: e.detail.value,
    })
  },

  // 投票描述
  bindDesTextAreaInput(e) {
    this.setData({
      desTextareaData: e.detail.value,
    })
  },

  // 提交投票
  postVote: async function() {
    const createTime = Date.parse(new Date())
    await this.uploadImage(this.data.imgList)
    try {
      const res = await createVote({
        openId: app.globalData.openId,
        voteTitle: this.data.newVoteTitle,
        desTextareaData: this.data.desTextareaData,
        isPrivate: this.data.isPrivate,
        voteOptionList: this.data.voteOptionList,
        userInfo: app.globalData.userInfo,
        votersCount: 0,
        imageList: this.data.imageList,
        createTime,
        endingTime: createTime + this.data.enableTime * 86400000,
      })
      wx.redirectTo({
        url: `/pages/detail/detail?voteId=${res.data.result._id}`,
      })
    } catch (error) {
      console.error(error)
    }
  },

  // 预览图片
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url,
    })
  },

  // 删除图片
  DelImg(e) {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除该照片吗？',
      cancelText: '取消',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1)
          this.setData({
            imgList: this.data.imgList,
          })
        }
      },
    })
  },

  // 选择图片
  ChooseImage() {
    wx.chooseImage({
      count: 4,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: res => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths),
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths,
          })
        }
      },
    })
  },

  // 上传图片
  uploadImage(imgList) {
    return new Promise(async (resolve, reject) => {
      let arr = []
      imgList.forEach((imgTmpUrl, index) => {
        arr[index] = new Promise(async (resolve, reject) => {
          try {
            const res = await await uploadImage(imgTmpUrl, 'image')
            console.log(res)
            this.data.imageList.push(res.data.url)
            resolve()
          } catch (error) {
            reject(error)
          }
        })
      })
      try {
        await Promise.all(arr)
        this.setData({
          imageList: this.data.imageList,
        })
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  },

  // 添加投票选项
  addVoteOption() {
    this.data.voteOptionList.push({
      content: '',
      count: 0,
    })
    this.setData({
      voteOptionList: this.data.voteOptionList,
    })
  },

  // 删除投票选项
  deleteVoteOption(e) {
    console.log(this.data.voteOptionList.length)
    if (this.data.voteOptionList.length <= 2) {
      wx.showToast({
        title: '选项至少为2项',
        icon: 'none',
        duration: 1000,
      })
    } else {
      const index = e.currentTarget.dataset.index
      this.data.voteOptionList.splice(index, 1)
      this.setData({
        voteOptionList: this.data.voteOptionList,
      })
    }
  },

  // 选项内容输入
  bindVoteInput(e) {
    const index = e.currentTarget.dataset.index
    this.data.voteOptionList[index].content = e.detail.value
    this.setData({
      voteOptionList: this.data.voteOptionList,
    })
  },

  // 投票类型
  radioChange(e) {
    this.setData({
      isPrivate: e.detail.value === '私密' ? true : false,
    })
  },

  // 更改生效时间
  changeEnableTime(e) {
    this.setData({
      enableTime: e.detail.value,
    })
  },
})
