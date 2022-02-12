import {
  User
} from "../../models/user"
import {
  Article
} from "../../models/article"

Component({
  properties: {
    userInfo: null,
    targetId: Number,
    likeStatus: Boolean,
    article: null
  },

  data: {
    loading: false,
    isCanDraw: false
  },

  methods: {
    onCreateShareImage() {
      this.setData({
        isCanDraw: !this.data.isCanDraw
      })
    },

    onComment() {
      this.triggerEvent("posting", {}, {})
    },

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
    },

    async onLike(event) {
      if (this.isLocked()) return
      this.locked()
      const like_or_cancel = event.detail.behavior
      const result = await Article.like(like_or_cancel, this.properties.targetId)
      this.setData({
        likeStatus: result.likeStatus
      })
      wx.showToast({
        title: like_or_cancel === "like" ? "已收藏！" : "已取消收藏！",
        icon: "none",
        duration: 1500,
        mask: true
      })
      this.triggerEvent(
        "likeClicked", {}, {}
      )
      this.unlocked()
    },

    isLocked() {
      return this.data.loading ? true : false
    },

    locked() {
      this.setData({
        loading: true
      })
    },

    unlocked() {
      this.setData({
        loading: false
      })
    },

  },

})