class Http {
  static async request({
    name,
    data
  }) {
    try {
      let res = await wx.cloud.callFunction({
        name,
        data
      })
      return res.result.data
    } catch (e) {
      Http.showError()
      return null
    }
  }

  static showError() {
    const tip = "发生未知异常"
    wx.lin.showToast({
      title: tip,
      icon: "error",
      duration: 3000
    })
  }
}

export {
  Http
}