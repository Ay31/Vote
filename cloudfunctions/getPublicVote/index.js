// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const vote = cloud.database().collection('vote')
const info = cloud.database().collection('info')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // let userList = []
  const res = await vote
    .where({
      isPrivate: false
    })
    .get()
  res.forEach(item => {
    let userList = []
    item.voteOptionList.forEach(option => {
      userList = userList.concat(option.supporters)
    })
    const avatarUrlList = getAvatarUrl(userList)
    Object.assign(item, { avatarUrlList })
  })

  function getAvatarUrl(userList) {
    const avatarUrlList = userList.map(async user => {
      const res = await info
        .where({
          _oppenid: user
        })
        .get()
      return res.avatarUrl
    })
    return avatarUrlList
  }

  console.log(res)
  return res
}
