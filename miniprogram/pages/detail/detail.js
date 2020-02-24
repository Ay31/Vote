import { getVoteDetail, submitVote, getRetio } from '../../common/api'
import * as echarts from '../../ec-canvas/echarts'

const app = getApp()

Page({
  data: {
    demo: '哈哈哈哈哈哈',
    voteData: {},
    swiperList: [],
    ratioList: [],
    userInfo: {},
    voteId: '',
    votedColor: ['#9dc8c8', '#58c9b9', '#519d9e', '#d1b6e1'],
    beforeVote: true,
    enable: true,
    ec: {},
    ecPie: {
      onInit: function(canvas, width, height) {
        const pieChart = echarts.init(canvas, null, {
          width: width,
          height: height,
        })
        canvas.setChart(pieChart)
        pieChart.setOption(getPieOption())

        return pieChart
      },
    },
  },

  ecPie: function(index) {
    console.log(index)
    return {
      onInit: function(canvas, width, height) {
        const pieChart = echarts.init(canvas, null, {
          width: width,
          height: height,
        })
        canvas.setChart(pieChart)
        pieChart.setOption(getPieOption())

        return pieChart
      },
    }
  },
  onLoad: async function(options) {
    demo = 'aaaaaaaaaaa'
    this.setData({ voteId: options.voteId })
    this.getVoteData(options.voteId, app.globalData.openId)
    this.getRetio()
  },

  // 轮播
  cardSwiper(e) {
    this.setData({ cardCur: e.detail.current })
  },

  // 获取投票数据
  getVoteData: async function(voteId, openId) {
    try {
      const res = await getVoteDetail({ voteId, openId })
      this.setData({
        voteData: res.data.voteDetail,
        swiperList: res.data.voteDetail.imageList,
        enable: res.data.voteDetail.endingTime > Date.now(),
        beforeVote: res.data.beforeVote,
        voteId,
      })
      this.data.voteData.voteOptionList.forEach(element => {
        element = Object.assign(element, {
          visable: true,
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
  getRetio: async function() {
    try {
      const res = await getRetio({ voteId: this.data.voteId })
      this.setData({ ratioList: res.data.ratioList })
    } catch (error) {
      console.log(error)
    }
  },

  // 提交投票
  async submitVote(data) {
    try {
      await submitVote({
        userInfo: app.globalData.userInfo,
        voteId: this.data.voteId,
        optionId: data.currentTarget.dataset.optionId,
        openId: app.globalData.openId,
      })
      await this.getRetio()
      this.setData({ beforeVote: false })
    } catch (error) {
      console.error(error)
    }
  },

  // 改变显示状态
  changeViable(data) {
    const index = data.currentTarget.dataset.index
    this.data.voteData.voteOptionList[index].visable = !this.data.voteData
      .voteOptionList[index].visable
    this.setData({
      voteData: this.data.voteData,
    })
  },

  echartInit(e) {
    initChart(e.detail.canvas, e.detail.width, e.detail.height)
  },

  // 初始化统计数据
  initChartData() {
    const optionData = this.data.voteData.voteOptionList
  },
})
function setData(res) {
  demo = res
}
let demo = 'hahahaha'
function getPieOption() {
  return {
    backgroundColor: '#ffffff',
    color: ['#37A2DA', '#32C5E9', '#67E0E3', '#91F2DE', '#FFDB5C', '#FF9F7F'],
    series: [
      {
        label: {
          normal: {
            fontSize: 14,
          },
        },
        type: 'pie',
        center: ['50%', '50%'],
        radius: [0, '60%'],
        data: [
          {
            value: 55,
            name: demo,
          },
          {
            value: 20,
            name: '武汉',
          },
          {
            value: 10,
            name: '杭州',
          },
          {
            value: 20,
            name: '广州',
          },
          {
            value: 38,
            name: '上海',
          },
        ],
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
