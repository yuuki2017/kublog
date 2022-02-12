import {
  Article
} from "../../models/article"
import {
  Keyword
} from "./keyword.js";
import {
  getRandomArr
} from "../../utils/util";
const keywordModel = new Keyword()

Page({
  data: {
    randomQ: "",
    q: "",
    hotKeywords: [],
    historyKeywords: [],
    tagColor: [],
    searching: false,
    inputFocus: true,
    searchResult: null,
    paging: null,
    showLoading: true,
    defaultLoadingtype: "loading",
  },

  onLoad() {
    this.initData()
  },

  async onReachBottom() {
    const data = await this.data.paging.getMoreData()
    if (!data) {
      return
    }
    this.setData({
      searchResult: data.accumulator
    })
    if (!data.moreData) {
      this.setData({
        loadingType: "end"
      })
    }
  },

  async initData() {
    this.setTagColor()
    this.setData({
      showLoading: false,
      hotKeywords: keywordModel.hotKeywords,
      historyKeywords: keywordModel.getHistory(),
    })
    this.setRandomQ()
  },

  onClear() {
    this.setData({
      showLoading: false,
      searching: false,
      inputFocus: true
    })
  },

  async onConfirm(e) {
    const q = e.detail.value || e.currentTarget.dataset.text || this.data.randomQ
    const qNoSpace = String(q).replace(/\s/g, '')
    const checkResult = this._checkKeyword(q, qNoSpace)
    if (!checkResult) {
      wx.showToast({
        title: "请输入搜索关键词！",
        icon: "none"
      })
      this.setData({
        inputFocus: true
      })
      return
    }
    this.setData({
      q,
      showLoading: true,
      searching: true,
      inputFocus: false
    })
    const paging = await Article.getSearch(qNoSpace)
    const data = await paging.getMoreData()
    if (!data) {
      return
    }
    keywordModel.addToHistory(qNoSpace)
    this.setData({
      showLoading: false,
      searchResult: data.data,
      paging,
      historyKeywords: keywordModel.getHistory(),
      loadingType: data.moreData ? "loading" : "end"
    })
  },

  onGotoArticleDetail(e) {
    const article = encodeURIComponent(JSON.stringify(e.currentTarget.dataset.article))
    wx.navigateTo({
      url: `../article-detail/article-detail?article=${article}`,
    })
  },

  setTagColor() {
    const tagColor = ["#574a7f", "#a2b86d", "#b95551", "#e4c374", "#2168B9", "#8e7a50", "#35323a", "#f5c5d5", "#89D7FD"]
    const result = getRandomArr(tagColor)
    this.setData({
      tagColor: result
    })
  },

  setRandomQ() {
    const num = Math.floor(Math.random() * (this.data.hotKeywords.length))
    this.setData({
      randomQ: this.data.hotKeywords[num]
    })
  },

  _checkKeyword(q, qNoSpace) {
    if (!qNoSpace || !q) {
      return false
    } else {
      return true
    }
  },

})