const getHeader = () => {
  let authorization,
    access_token,
    hasTokenOnStorage = true
  try {
    authorization = wx.getStorageSync('authorization')
    access_token = wx.getStorageSync('access_token')
    hasTokenOnStorage = !!authorization
  } catch (e) {
    hasTokenOnStorage = false
  }

  if (!hasTokenOnStorage) return

  return {
    accept: 'application/json',
    Authorization: access_token,
  }
}

const requestAll = (url, data, method, header) => {
  console.log(data)
  return new Promise((reslove, reject) => {
    wx.request({
      url,
      data,
      method,
      header,
      success: res => {
        if (res.statusCode === 200) {
          reslove(res)
        } else {
          reject(res)
        }
      },
      fail: err => reject(err),
    })
  })
}

const getRequest = (url, data, header = getHeader()) => {
  return requestAll(url, data, 'GET', header)
}

const postRequest = (url, data, header = getHeader()) => {
  return requestAll(url, data, 'POST', header)
}

const deleteRequest = (url, data, header = getHeader()) => {
  return requestAll(url, data, 'DELETE', header)
}

export { getRequest, postRequest, deleteRequest }
