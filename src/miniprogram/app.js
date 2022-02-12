import {
  User
} from "./models/user"

App({
  globalData: {
    StatusBar: null,
    Custom: null,
    CustomBar: null,
    WindowHeight: null
  },

  async onLaunch() {
    this._getInitdata()
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // 填入你自己的云开发环境id
        // env: '',
        traceUser: true,
      })
    }
    this._handleUserInfo()
  },

  async _handleUserInfo() {
    const userInfo = User.getLocalUserInfo("userInfo", false)
    if (!userInfo) {
      await User.addUser()
    }
  },

  _getInitdata() {
    const res = wx.getSystemInfoSync()
    const capsule = wx.getMenuButtonBoundingClientRect()
    this.globalData.StatusBar = res.statusBarHeight
    this.globalData.WindowHeight = res.screenHeight
    if (capsule) {
      this.globalData.Custom = capsule
      this.globalData.CustomBar = capsule.bottom + capsule.top - res.statusBarHeight
    } else {
      this.globalData.CustomBar = res.statusBarHeight + 50
    }
  }

})