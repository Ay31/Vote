//index.js
const app = getApp();
const db = wx.cloud.database();
const info = db.collection('info');

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    openId: '',
    isHide: false

  },

  onLoad: function () {
    const self = this;
    wx.getSetting({
      success: function (res) {
        console.log(res);
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              wx.login({
                success: res => {
                  console.log("用户的code:" + res.code);
                }
              });
            }
          });
        } else {
          self.setData({
            isHide: true
          });
        }
      }
    });
    this.getOpenId();
  },

  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      const self = this;
      const userInfo = e.detail.userInfo;
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
      this.setData({
        userInfo: self.data.userInfo,
        isHide: false
      });
      info.where({
          openId: self.data.openId
        }).get()
        .then(res => {
          console.log(res);
          if (!res.data.length) {
            console.log(self.data.openId);
            info.doc('dbff9fc75e017eab066a8023574270bc').update({
              data: {
                userInfo: {
                  avatarUrl: userInfo.avatarUrl,
                  nickName: userInfo.nickName,
                  country: userInfo.country,
                  city: userInfo.city
                }
              }
            })
          } else {
            console.log('hi');
          }
        })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },

  getOpenId() {
    const self = this;
    wx.cloud.callFunction({
        name: 'login',
      })
      .then(data => {
        console.log('云函数获取到的openId: ', data.result.openId)
        // const openId = data.result.openId;
        this.setData({
          openId: data.result.openId
        });
        info.where({
            oppeId: data.result.openId
          })
          .get()
          .then(data => {
            if (!data.data.length) {
              info.add({
                data: {
                  oppeId: self.data.openId
                }
              })
            }
          })
      })
  },

  // 跳转至创建投票页
  targetToAdd() {
    wx.navigateTo({
      url: `/pages/vote/vote?`,
      success(data) {
        console.log(data);
      },
    })
  },
  
  // 跳转至快速投票页
  targetToQuick() {
    wx.navigateTo({
      url: '/pages/quickVote/quickVote',
      success(data) {
        console.log(data);
      },
    })
  },
})