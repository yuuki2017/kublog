import {
  Category
} from "../../models/category"
import {
  Article
} from "../../models/article"
import {
  User
} from "../../models/user"
import {
  px2rpx
} from '../../miniprogram_npm/lin-ui/utils/util'

const app = getApp()

Page({
  data: {
    Custom: app.globalData.Custom,
    CustomBar: app.globalData.CustomBar,
    WindowHeight: app.globalData.WindowHeight,
    navFixed: false,
    segmentCount: null,
    swiperHeight: null,
    jishuScrollHeight: null,
    showList: false,
    articleCategories: null,
    currentTypeIndex: 0,
    currentCategoryIndex: 0,
    zajiArticles: null,
    jishuArticles: null,
    defaultLoadingtype: "loading",
    showLoading: true,
    showNormalLoading: false,
    userInfo: null
  },

  onShareAppMessage() {},

  async onLoad() {
    this.initNaviHeight()
    this.initData()
  },

  onShow() {
    if (!this.data.userInfo) {
      this.getLocalUserInfo()
    }
  },

  getLocalUserInfo() {
    const userInfo = User.getLocalUserInfo("userInfo", false)
    if (userInfo) {
      this.setData({
        userInfo
      })
    }
  },

  async onScrollBottom(e) {
    if (this.data.currentTypeIndex === 0) {
      const categoryId = e.currentTarget.dataset.categoryid
      var temp = "jishuArticles[" + categoryId + "].detail"
      var loadingTypeTemp = "jishuArticles[" + categoryId + "].loadingType"
      var data = await this.data.jishuArticles[categoryId].paging.getMoreData()
    } else {
      var temp = "zajiArticles.detail"
      var loadingTypeTemp = "zajiArticles.loadingType"
      var data = await this.data.zajiArticles.paging.getMoreData()
    }
    if (!data) {
      return
    }
    this.setData({
      [temp]: data.accumulator
    })
    if (!data.moreData) {
      this.setData({
        [loadingTypeTemp]: "end"
      })
    }
  },

  async initData() {
    await this.getArticleCategories()
    await this.getArticlesByTypeAndCategory(1, 0)
    this.setData({
      showLoading: false
    })
  },

  async getArticleCategories() {
    let res = await Category.getArticleCategories()
    const recommend = {
      _id: 0,
      name: "推荐"
    }
    res.unshift(recommend)
    const result = this._setJishuArticlesArr(res.length)
    this.setData({
      articleCategories: res,
      jishuArticles: result,
      segmentCount: res.length
    })
  },

  async getArticlesByTypeAndCategory(typeId, categoryId) {
    const paging = await Article.getArticlesByTypeAndCategory(typeId, categoryId)
    const data = await paging.getMoreData()
    if (!data) {
      return
    }
    if (typeId !== 1) {
      var detailTemp = "zajiArticles.detail"
      var pagingTemp = "zajiArticles.paging"
      var loadingTypeTemp = "zajiArticles.loadingType"
    } else {
      var detailTemp = "jishuArticles[" + categoryId + "].detail"
      var pagingTemp = "jishuArticles[" + categoryId + "].paging"
      var loadingTypeTemp = "jishuArticles[" + categoryId + "].loadingType"
    }
    this.setData({
      [detailTemp]: data.data,
      [pagingTemp]: paging,
      [loadingTypeTemp]: data.moreData ? "loading" : "end"
    })
  },

  initNaviHeight() {
    wx.createSelectorQuery().select(".segment-view").boundingClientRect(rect => {
      this.setData({
        swiperHeight: px2rpx(this.data.WindowHeight - this.data.CustomBar - rect.height),
        jishuScrollHeight: px2rpx(this.data.WindowHeight - this.data.CustomBar - rect.height * 2)
      })
    }).exec()
  },

  async onChangeTab(e) {
    this._hideNormalLoading()
    this.setData({
      currentTypeIndex: e.detail.currentIndex
    })
    if (e.detail.currentIndex === 0) {
      this._handleLoadedData("jishuArticles", true)
      return
    }
    this._handleLoadedData("zajiArticles", false)
  },

  async onChangeSegment(e) {
    this._hideNormalLoading()
    this.setData({
      currentCategoryIndex: e.detail.currentIndex
    })
    this._handleLoadedData("jishuArticles", true)
  },

  onGotoArticleDetail(e) {
    const article = encodeURIComponent(JSON.stringify(e.currentTarget.dataset.article))
    wx.navigateTo({
      url: `../article-detail/article-detail?article=${article}`
    })
  },

  onSearch() {
    wx.navigateTo({
      url: `../search/search`
    })
  },

  onShowList() {
    if (!this.data.showList) {
      this.setData({
        showList: true
      })
    } else {
      this.setData({
        showList: false
      })
    }
  },

  onHideList() {
    this.setData({
      showList: false
    })
  },

  async _handleLoadedData(articleType, isObject) {
    if (!this._isLoadedData(articleType, isObject, this.data.currentCategoryIndex)) {
      this.setData({
        showNormalLoading: true
      })
      await this.getArticlesByTypeAndCategory(this.data.currentTypeIndex + 1, this.data.currentTypeIndex === 0 ? this.data.currentCategoryIndex : 0)
      this.setData({
        showNormalLoading: false
      })
    }
  },

  _setJishuArticlesArr(length) {
    let tempArr = []
    for (let index = 0; index < length; index++) {
      tempArr.push({
        detail: null
      })
    }
    return tempArr
  },

  _isLoadedData(categoryName, isObject, objectIndex) {
    if (!isObject) {
      if (this.data[categoryName] != null) return true
      else return false
    } else {
      if (this.data[categoryName][objectIndex].detail != null) return true
      else return false
    }
  },

  _hideNormalLoading(){
    if(this.data.showNormalLoading){
      this.setData({
        showNormalLoading: false
      })
    }
  }

})