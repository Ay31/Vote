// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const vote = cloud.database().collection("vote");

// 云函数入口函数
exports.main = async (event, context) => {
  
  const res = await vote.doc(event.voteId).get();
  const currentTime = Date.parse(new Date());

  if (currentTime > res.data.endingTime) {
    vote.doc(event.voteId).update({
      data: {
        enable: false
      }
    })
  }

  return !(currentTime > res.data.endingTime);
}