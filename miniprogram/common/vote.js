import { postRequest, getRequest } from './request'
import { baseUrl } from '../config'

export const testVote = () => {
  getRequest(`${baseUrl}/api/vote/test`)
}

// 创建投票
export const createVote = data => {
  return postRequest(`${baseUrl}/api/vote/createVote`, data)
}

// 获取投票详情
export const getVoteDetail = data => {
  return getRequest(`${baseUrl}/api/vote/getVoteDetail?voteId=${data.voteId}`)
}

// 提交投票
export const submitVote = data => {
  return postRequest(`${baseUrl}/api/vote/submitVote`, data)
}

// 获取投票占比
export const getRetio = data => {
  return postRequest(`${baseUrl}/api/vote/getRetio`, data)
}

// 获取投票列表
export const getVoteList = data => {
  return getRequest(`${baseUrl}/api/vote/getVoteList?openId=${data.openId}`)
}

// export default *