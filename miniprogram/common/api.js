import { postRequest, getRequest } from './request'
import { uploadFile } from './upload'
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
  console.log(data)
  return getRequest(
    `${baseUrl}/api/vote/getVoteDetail?voteId=${data.voteId}&openId=${data.openId}`
  )
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

// 获取热门投票列表
export const getHotVoteList = data => {
  return getRequest(`${baseUrl}/api/vote/getHotVoteList?openId=${data.openId}`)
}

// 上传图片
export const uploadImage = (filePath, name, formData) => {
  return uploadFile(`${baseUrl}/source/uploadImage`, filePath, name, formData)
}

// export default *
