Component({
  properties: {
    isCanDraw: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal) {
        newVal && this.drawPic()
      }
    },
    article: null
  },

  data: {
    isModal: false,
    imgDraw: {},
    sharePath: "",
    visible: false
  },

  methods: {
    handlePhotoSaved() {
      this.savePhoto(this.data.sharePath)
    },

    handleClose() {
      this.setData({
        visible: false
      })
    },

    drawPic() {
      if (this.data.sharePath) {
        this.setData({
          visible: true
        })
        this.triggerEvent("initData")
        return
      }
      wx.showLoading({
        title: "生成中"
      })
      const avatarUrl = wx.getStorageSync("userInfo").avatarUrl || "https://6b75-kublog-dev-lnrk6-1256865363.tcb.qcloud.la/common/default_portrait.png?sign=636bfb07ede1c124fa7aac2d1aa779aa&t=1591378912"
      const nickName = wx.getStorageSync("userInfo").nickName || "小星星"
      this.setData({
        imgDraw: {
          width: "750rpx",
          height: "1200rpx",
          views: [{
              type: "image",
              url: "https://6b75-kublog-dev-lnrk6-1256865363.tcb.qcloud.la/common/poster.png?sign=776fcea919acc366944d79a64efc66d7&t=1591378013",
              css: {
                width: "750rpx",
                height: "420rpx"
              },
            },
            {
              type: "image",
              url: avatarUrl,
              css: {
                top: "340rpx",
                left: "328rpx",
                width: "96rpx",
                height: "96rpx",
                borderWidth: "6rpx",
                borderColor: "#FFF",
                borderRadius: "96rpx"
              }
            },
            {
              type: "text",
              text: nickName,
              css: {
                top: "470rpx",
                fontSize: "28rpx",
                left: "375rpx",
                align: "center",
                color: "#3c3c3c"
              }
            },
            {
              type: "text",
              text: `正在分享一篇很有意思的文章：`,
              css: {
                top: "510rpx",
                left: "375rpx",
                align: "center",
                fontSize: "28rpx",
                color: "#3c3c3c"
              }
            },
            {
              type: "text",
              text: this.properties.article.title,
              css: {
                top: "590rpx",
                left: "375rpx",
                align: "center",
                fontSize: "34rpx",
                fontWeight: "bold",
                color: "#3c3c3c",
                width: "620rpx",
                maxLines: 1,
              }
            },
            {
              type: "text",
              text: this.properties.article.synopsis,
              css: {
                top: "650rpx",
                left: "375rpx",
                align: "center",
                fontSize: "28rpx",
                color: "#3c3c3c",
                width: "560rpx",
                maxLines: 4,
                textAlign: "left",
                lineHeight: "52rpx"
              }
            },
            {
              type: "image",
              url: "https://6b75-kublog-dev-lnrk6-1256865363.tcb.qcloud.la/common/qr_info_normal.png?sign=5be271c293770aa7f47b7bc5c568fb67&t=1592217417",
              css: {
                top: "920rpx",
                left: "126rpx",
                width: "500rpx",
                height: "300rpx"
              }
            }
          ]
        }
      })
    },

    onImgErr(e) {
      wx.hideLoading()
      wx.showToast({
        title: "生成分享图失败，请刷新页面重试"
      })
    },

    onImgOK(e) {
      wx.hideLoading()
      this.setData({
        sharePath: e.detail.path,
        visible: true,
      })
      this.triggerEvent("initData")
    },

    preventDefault() {},

    savePhoto(path) {
      wx.showLoading({
        title: "正在保存...",
        mask: true
      })
      this.setData({
        isDrawImage: false
      })
      wx.saveImageToPhotosAlbum({
        filePath: path,
        success: (res) => {
          wx.showToast({
            title: "保存成功,打开相册去分享吧~",
            icon: "none"
          })
          setTimeout(() => {
            this.setData({
              visible: false
            })
          }, 300)
          this.triggerEvent("saveResult")
        },
        fail: (res) => {
          wx.getSetting({
            success: res => {
              let authSetting = res.authSetting
              if (!authSetting["scope.writePhotosAlbum"]) {
                this.setData({
                  isModal: true
                })
              }
            }
          })
          setTimeout(() => {
            wx.hideLoading()
            this.setData({
              visible: false
            })
          }, 300)
        }
      })
    }

  }
})