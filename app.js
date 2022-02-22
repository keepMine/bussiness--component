// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    wx.cloud.init()
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    wx.getSystemInfo({
      success: (res) => {
        console.log(res)
        this.globalData.height = res.screenHeight
      }
    })
  },
  globalData: {
    userInfo: null,
    height: ''
  }
})
