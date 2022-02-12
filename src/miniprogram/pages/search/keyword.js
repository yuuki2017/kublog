class Keyword{
  key = "q"
  maxLength = 15
  hotKeywords = ["小程序", "Java", "Mysql", "云开发", "云函数", "SpringBoot", "Vue", "日本", "日语"]

  getHistory() {
    const keywords = wx.getStorageSync(this.key)
    if (!keywords)
      return []
    return keywords
  }

  addToHistory(keyword) {
    let keywords = this.getHistory()
    const has = keywords.includes(keyword)
    if (!has) {
      const length = keywords.length
      if (length >= this.maxLength) {
        keywords.pop()
      }
      keywords.unshift(keyword)
      wx.setStorageSync(this.key, keywords)
    }else{
      keywords.splice(keywords.indexOf(keyword),1)
      keywords.unshift(keyword)
      wx.setStorageSync(this.key, keywords)
    }
  }
}

export {
  Keyword
}