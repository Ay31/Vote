// miniprogram/pages/vote/vote.js
import { createVote, uploadImage } from '../../common/api'

const app = getApp()

Page({
  data: {
    target: 'NORMAL',
    voteTitle: '',
    desTextareaData: '',
    isPrivate: false,
    isAnonymous: false,
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

  onLoad(option) {
    this.setData({
      target: option.target,
    })
    if (option.target === 'SIMPLE') {
      this.setData({
        voteOptionList: [
          {
            content: 'YES',
            count: 0,
          },
          {
            content: 'NO',
            count: 0,
          },
        ],
      })
    }
    wx.setNavigationBarTitle({
      title: '创建投票',
    })
  },

  // 投票标题
  bindTitleInput(e) {
    this.setData({
      voteTitle: e.detail.value,
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
    if (this.checkVoteTitle() && this.checkVoteOption() && this.checkDec()) {
      const createTime = Date.parse(new Date())
      const {
        voteTitle,
        desTextareaData,
        isPrivate,
        isAnonymous,
        voteOptionList,
        imageList,
        enableTime,
      } = this.data
      await this.uploadImage(this.data.imgList)
      try {
        const res = await createVote({
          openId: app.globalData.openId,
          voteTitle,
          desTextareaData,
          isPrivate,
          isAnonymous,
          voteOptionList,
          userInfo: app.globalData.userInfo,
          votersCount: 0,
          imageList,
          createTime,
          endingTime: createTime + enableTime * 86400000,
        })
        wx.redirectTo({
          url: `/pages/vote/vote?voteId=${res.data.result._id}`,
        })
      } catch (error) {
        console.error(error)
      }
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
    if (this.data.voteOptionList.length >= 4) {
      wx.showToast({
        title: '选项至多为4项',
        icon: 'none',
        duration: 1000,
      })
    } else {
      this.data.voteOptionList.push({
        content: '',
        count: 0,
      })
      this.setData({
        voteOptionList: this.data.voteOptionList,
      })
    }
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
      isPrivate: Boolean(e.detail.value),
    })
  },

  // 更改生效时间
  changeEnableTime(e) {
    this.setData({
      enableTime: e.detail.value,
    })
  },

  // 是否匿名投票
  changeAnonymous(e) {
    console.log(e)
    this.setData({
      isAnonymous: Boolean(e.detail.value),
    })
  },

  // 标题校验
  checkVoteTitle() {
    const title = this.data.voteTitle
    if (title.length < 2) {
      wx.showToast({
        title: '投票标题至少2字',
        icon: 'none',
        duration: 1000,
      })
      return false
    } else if (title.length > 10) {
      wx.showToast({
        title: '投票标题至多10字',
        icon: 'none',
        duration: 1000,
      })
      return false
    } else return true
  },

  // 校验描述
  checkDec() {
    const dec = this.data.desTextareaData
    if (dec.length > 100) {
      wx.showToast({
        title: '描述内容至多50字',
        icon: 'none',
        duration: 1000,
      })
      return false
    } else return true
  },

  // 校验选项
  checkVoteOption() {
    const options = this.data.voteOptionList
    const spaceArr = options.filter(item => {
      return item.content === '' || item.content.indexOf(' ') === 0
    })
    const lengthArr = options.filter(item => {
      return item.content.length > 20
    })
    if (spaceArr.length > 0) {
      wx.showToast({
        title: '选项不能为空',
        icon: 'none',
        duration: 1000,
      })
      return false
    }
    if (lengthArr.length > 0) {
      wx.showToast({
        title: '选项至多10中文长度',
        icon: 'none',
        duration: 1000,
      })
      return false
    }
    return true
  },
})
