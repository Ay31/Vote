// components/voteItem/voteItem.js
import { getVoteDetail, submitVote, getRetio } from '../../common/api'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    voteItem: Object,
    pageType: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    ratioList: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {},
  attached() {
    this.getRetio()
  },
})
