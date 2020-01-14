// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();

// const info = cloud.database().collection("info");
const vote = cloud.database().collection("vote");

// 云函数入口函数
exports.main = async (event, context) => {
  let userList = [];
  const res = await vote.doc(event.voteId).get();

  res.data.voteOptionList.forEach(option => {
    userList = userList.concat(option.supporters);
  });
  console.log(userList);
  console.log(event.openId);
  console.log(userList.indexOf(event.openId));

  // // info.where({});

  return userList.indexOf(event.openId) === -1 ? true : false;
};
