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

const uploadFile = (
  url,
  filePath,
  name,
  formData,
  timeout,
  header = getHeader()
) => {
  return new Promise((reslove, reject) => {
    wx.uploadFile({
      url,
      filePath,
      name,
      formData,
      timeout,
      header,
      success: res => {
        if (res.statusCode === 200) {
          res.data = JSON.parse(res.data)
          reslove(res)
        } else {
          reject(res)
        }
      },
      fail: err => reject(err),
    })
  })
}

export { uploadFile }
