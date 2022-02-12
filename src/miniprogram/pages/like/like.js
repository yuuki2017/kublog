import {
  Article
} from "../../models/article"

Page({
  data: {
    like: null,
    paging: null,
    showLoading: true,
    defaultLoadingtype: "loading",
    refresh: false
  },

  onLoad() {
    this.initData()
  },

  onShow() {
    if (this.data.refresh) {
      this.initData()
    }
    this.data.refresh = false
  },

  async onReachBottom() {
    const data = await this.data.paging.getMoreData()
    if (!data) {
      return
    }
    this.setData({
      like: data.accumulator
    })
    if (!data.moreData) {
      this.setData({
        loadingType: "end"
      })
    }
  },

  async initData() {
    await this.getLike()
    this.setData({
      showLoading: false
    })
  },

  async getLike() {
    const paging = Article.getLike()
    const data = await paging.getMoreData()
    if (!data) {
        return
    }
    this.setData({
      like: data.data,
      paging,
      loadingType: data.moreData ? "loading" : "end"
    })
  },

  onGotoArticleDetail(e) {
    const article = encodeURIComponent(JSON.stringify(e.currentTarget.dataset.article))
    wx.navigateTo({
      url: `../article-detail/article-detail?article=${article}`,
      events: {
        someEvent: (refresh) => {
          this.data.refresh = true
        }
      },
    })
  }

})