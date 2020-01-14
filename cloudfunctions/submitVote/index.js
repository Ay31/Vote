// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init();
const db = cloud.database();
const vote = cloud.database().collection("vote");
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  await vote.doc(event.voteId).update({
    data: {
      voteOptionList: {
        [event.index]: {
          count: _.inc(1),
          supporters: _.push(event.openId)
        }
      }
    }
  });

  return {
    event
  };
};
