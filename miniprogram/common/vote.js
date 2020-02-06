import { postRequest, getRequest } from './request'
import { baseUrl } from '../config'

const testVote = () => {
  getRequest(`${baseUrl}/api/vote/test`)
}

const createVote = data => {
  return postRequest(`${baseUrl}/api/vote/createVote`, data)
}

export { testVote, createVote }
