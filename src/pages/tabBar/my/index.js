// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    userinfo: {}
  },

  onLoad() {
  
  },

  getuserinfo(res) {
    wx.getUserProfile({
      desc: '用于展示昵称头像',
      success: (res) => {
        console.log(res)
        this.setData({
          userinfo: res.userInfo
        })
      }
    })
    
  }
})
