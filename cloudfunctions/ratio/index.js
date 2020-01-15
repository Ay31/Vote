// 云函数入口文件
const cloud = require("wx-server-sdk");
cloud.init();

const vote = cloud.database().collection("vote");

// 云函数入口函数
exports.main = async (event, context) => {
  const res = await vote.doc(event.voteId).get();

  const total = res.data.voteOptionList.reduce((prev, item) => {
    return prev + item.count;
  }, 0);

  const ratioList = res.data.voteOptionList.map(item => {
    if (item.count === 0) return 0;
    return Math.round((item.count / total) * 100);
  });

  return {
    ratioList
  };
};