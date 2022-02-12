import {
  getRandomArr
} from "../../utils/util"
import {
  data
} from "./data.js"
import {
  User
} from "../../models/user"

const app = getApp()
let touchDotX = 0
let touchDotY = 0
let interval
let time = 0

Component({
  properties: {
    showList: Boolean,
    userInfo: null
  },

  data: {
    projectArr: data,
    CustomBar: app.globalData.CustomBar,
    WindowHeight: app.globalData.WindowHeight,
  },

  methods: {
    preventTouchMove() {},
    
    onGetUserInfo(e) {
      const userInfo = e.detail.userInfo
      if (!userInfo) {
        wx.lin.showToast({
          title: "您拒绝了登录",
          icon: "error"
        })
        return
      }
      this.setData({
        userInfo
      })
      wx.lin.showToast({
        title: "登录成功！",
        icon: "success"
      })
      User.updateUserInfo(userInfo)
      if(e.currentTarget.dataset.itemname){
        this.onItemClick(e)
      }
    },

    onCopyLink(e) {
      wx.setClipboardData({
        data: "https://github.com/yuuki2017/kublog",
        success: res => {
          wx.hideToast({})
          wx.lin.showToast({
            title: "链接已复制，去浏览器打开吧~",
            icon: "success",
            mask: true
          })
        }
      })
    },

    onShowSupportCode() {
      wx.previewImage({
        urls: ["cloud://kublog-dev-lnrk6.6b75-kublog-dev-lnrk6-1256865363/common/support_code.png"],
      })
    },

    onHideList() {
      this.triggerEvent("hideList", {})
    },

    onItemClick(e) {
      const itemName = e.currentTarget.dataset.itemname
      wx.navigateTo({
        url: `../../pages/${itemName}/${itemName}`
      })
    },

    onTouchStart(e) {
      touchDotX = e.touches[0].pageX
      touchDotY = e.touches[0].pageY
      interval = setInterval(function () {
        time++
      }, 100)
    },

    onTouchEnd(e) {
      let touchMoveX = e.changedTouches[0].pageX
      let touchMoveY = e.changedTouches[0].pageY
      let tmX = touchMoveX - touchDotX
      let tmY = touchMoveY - touchDotY
      if (time < 20) {
        let absX = Math.abs(tmX)
        let absY = Math.abs(tmY)
        if (absX > 2 * absY) {
          if (tmX < 0) {
            this.setData({
              showList: false
            })
          } else {
            this.setData({
              showList: true
            })
          }
        }
      }
      clearInterval(interval)
      time = 0
    },

    setListIconColor() {
      const arr = ["blue", "green", "purple", "red", "orange", "olive", "cyan", "yellow"]
      const result = getRandomArr(arr)
      for (let i = 0; i < result.length; i++) {
        let temp = "projectArr[" + i + "].iconColor"
        this.setData({
          [temp]: result[i]
        })
      }
    },
  },

  lifetimes: {
    attached() {
      this.setListIconColor()
    },
  },

})