Component({
  properties: {
    data: Object
  },

  methods: {
    onClick(e) {
      if(e.currentTarget.dataset.appid){
        const appId =e.currentTarget.dataset.appid
        const path =e.currentTarget.dataset.path
        wx.navigateToMiniProgram({
          appId: appId,
          path: path
        })
      }else{
        wx.setClipboardData({
          data: e.currentTarget.dataset.link,
          success: res => {
            wx.hideToast({})
            wx.lin.showToast({
              title: '链接已复制，去浏览器打开吧~',
              icon: 'success',
              mask: true
            })
          }
        })
      }
    }
  }
})