import { getVoteDetail, getRetio, getVoteAnalysis } from '../../common/api'
import * as echarts from '../../ec-canvas/echarts'

const app = getApp()

Page({
  data: {
    voteData: {},
    ratioList: [],
    voteId: '',
    votedColor: ['#9dc8c8', '#58c9b9', '#519d9e', '#d1b6e1'],
    avatarData: [],
    beforeVote: true,
    enable: true,
    cityEc: {
      // 城市图表
      onInit: function (canvas, width, height) {
        const pieChart = echarts.init(canvas, null, {
          width: width,
          height: height,
        })
        canvas.setChart()
        pieChart.setOption(getCityOption())
        return pieChart
      },
    },
    provinceEc: {
      // 省份图表
      onInit: function (canvas, width, height) {
        const pieChart = echarts.init(canvas, null, {
          width: width,
          height: height,
        })
        canvas.setChart()
        pieChart.setOption(getProvinceOption())
        return pieChart
      },
    },
    genderEc: {
      // 性别图表
      onInit: function (canvas, width, height) {
        const pieChart = echarts.init(canvas, null, {
          width: width,
          height: height,
        })
        canvas.setChart()
        pieChart.setOption(getGenderOption())
        return pieChart
      },
    },
  },

  onLoad: async function (options) {
    this.setData({ voteId: options.voteId })
    this.getVoteData(options.voteId, app.globalData.openId)
    this.getRetio()
    this.getVoteAnalysis()
  },

  // 获取投票数据
  getVoteData: async function (voteId, openId) {
    try {
      const res = await getVoteDetail({ voteId, openId })
      this.setData({
        voteData: res.data.voteDetail,
        swiperList: res.data.voteDetail.imageList,
        enable: res.data.voteDetail.endingTime > Date.now(),
        beforeVote: res.data.beforeVote,
        voteId,
      })
      this.data.voteData.voteOptionList.forEach((element) => {
        element = Object.assign(element, {
          visable: false,
        })
      })
      this.setData({
        voteData: this.data.voteData,
      })
      console.log('getVoteData')
    } catch (error) {
      console.error(error)
    }
  },

  // 获取选项占比
  getRetio: async function () {
    try {
      const res = await getRetio({ voteId: this.data.voteId })
      this.setData({ ratioList: res.data.ratioList })
    } catch (error) {
      console.log(error)
    }
  },

  // 获取数据分析
  async getVoteAnalysis() {
    try {
      const res = await getVoteAnalysis({ voteId: this.data.voteId })
      console.log(this.data.voteId)
      this.setData({
        detailData: res.data.detailData,
      })
      detailData = res.data.detailData
    } catch (error) {
      console.log(error)
    }
  },

  // 改变显示状态
  changeViable(data) {
    const index = data.currentTarget.dataset.index
    VisIndex = data.currentTarget.dataset.index
    this.data.voteData.voteOptionList[index].visable = !this.data.voteData
      .voteOptionList[index].visable
    this.setData({
      voteData: this.data.voteData,
    })
  },
})

// 图表部分

let VisIndex = 0
let detailData = []

// 获取图表数据
function getOptionData(key) {
  return detailData[VisIndex][`${key}Data`]
}

// 获取图表显示参数

function getCityOption() {
  return {
    backgroundColor: '#ffffff',
    color: ['#60acfc', '#32d3eb', '#5bc49f', '#feb64d', '#ff7c7c', '#9287e7'],
    series: [
      {
        label: {
          normal: {
            fontSize: 14,
            rich: {},
          },
        },
        type: 'pie',
        center: ['50%', '50%'],
        radius: [0, '60%'],
        data: getOptionData('city'),
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 2, 2, 0.3)',
          },
        },
      },
    ],
  }
}

function getProvinceOption() {
  return {
    backgroundColor: '#ffffff',
    color: ['#feb64d', '#ff7c7c', '#9287e7', '#60acfc', '#32d3eb', '#5bc49f'],
    series: [
      {
        label: {
          normal: {
            fontSize: 14,
            rich: {},
          },
        },
        type: 'pie',
        center: ['50%', '50%'],
        radius: [0, '60%'],
        data: getOptionData('province'),
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 2, 2, 0.3)',
          },
        },
      },
    ],
  }
}

function getGenderOption() {
  return {
    backgroundColor: '#ffffff',
    color: ['#9287e7', '#60acfc', '#feb64d', '#ff7c7c', '#32d3eb', '#5bc49f'],
    series: [
      {
        label: {
          normal: {
            fontSize: 14,
            rich: {},
          },
        },
        type: 'pie',
        center: ['50%', '50%'],
        radius: [0, '60%'],
        data: getOptionData('gender'),
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 2, 2, 0.3)',
          },
        },
      },
    ],
  }
}
