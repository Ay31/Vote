// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

const vote = cloud.database().collection("vote");

// 云函数入口函数
exports.main = async (event, context) => {
  let userList = [];

  const res = await vote.doc(event.voteId).get();

  res.data.voteOptionList.forEach(option => {
    userList = userList.concat(option.supporters);
  });

  return userList.indexOf(event.openId) === -1 ? true : false;
};