// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const vote = cloud.database().collection('vote')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const res = await vote
    .where({
      isPrivate: false
    })
    .get()

  console.log(res)
  return res
}
