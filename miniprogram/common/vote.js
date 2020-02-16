import { postRequest, getRequest } from './request'
import { baseUrl } from '../config'

const testVote = () => {
  getRequest(`${baseUrl}/api/vote/test`)
}

// 创建投票
const createVote = data => {
  return postRequest(`${baseUrl}/api/vote/createVote`, data)
}

// 获取投票详情
const getVoteDetail = data => {
  return getRequest(`${baseUrl}/api/vote/getVoteDetail?voteId=${data.voteId}`)
}

// 提交投票
const submitVote = data => {
  return postRequest(`${baseUrl}/api/vote/submitVote`, data)
}

// 获取投票占比
const getRetio = voteId => {
  return postRequest(`${baseUrl}/api/vote/getRetio`, voteId)
}
export { testVote, createVote, getVoteDetail, submitVote, getRetio }
