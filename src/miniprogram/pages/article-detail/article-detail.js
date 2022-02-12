import {
  getRandomArr
} from "../../utils/util"
import {
  User
} from "../../models/user"
import {
  Article
} from "../../models/article"

Page({
  data: {
    article: null,
    showSkeleton: true,
    userInfo: null,
    likeStatus: false,
    posting: false,
    currentPage: 1,
    totalPage: null,
    paging: null,
    comment: null,
    defaultLoadingtype: "loading",
    showToTop: false,
    showTopHeight: 0,
    tagColor: [],
    tagStyle: {
      pre: 'padding:1em 1em 0 1em;margin:.5em 0;border-radius:0.3em;background:#F6F6F6;color:#7c7c7c;line-height: 1.5;font-family:Consolas,Monaco,"Andale Mono","Ubuntu Mono",monospace;position:relative;word-wrap:break-word;white-space:pre-wrap;',
      code: 'background-color:#f0f0f0;font-size:85%;margin:0 3px;padding:2px 5px 2px 5px;border-radius:2px;font-family:SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;',
      img: 'margin:20rpx 0 20rpx 0;'
    }
  },

  onShareAppMessage() {
    const article = encodeURIComponent(JSON.stringify(this.data.article))
    return {
      title: this.data.article.title,
      path: `/pages/article-detail/article-detail?article=${article}`,
    }
  },

  onPageScroll(event) {
    if (this.data.comment && this.data.comment.length >= 20) {
      if (this.data.showTopHeight === 0) {
        this.data.showTopHeight = event.scrollTop
      }
      if (event.scrollTop <= 0) event.scrollTop = 0
      if (event.scrollTop > this.data.showTopHeight) {
        if (!this.data.showToTop)
          this.setData({
            showToTop: true
          })
      } else {
        if (this.data.showToTop)
          this.setData({
            showToTop: false
          })
      }
    }
  },

  onToTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },

  async onReachBottom() {
    if (this.data.comment.length === 0 || !this.data.paging.moreData) {
      return
    }
    this.setData({
      currentPage: this.data.paging.currentPage
    })
    const data = await this.data.paging.getMoreData()
    if (!data) {
      return
    }
    this.setData({
      comment: data.accumulator
    })
    if (!data.moreData) {
      this.setData({
        loadingType: "end"
      })
    }
  },

  onLoad(options) {
    const article = JSON.parse(decodeURIComponent(options.article))
    article.tag = this.handleTag(article.tag)
    article.content = article.content.replace(new RegExp("<cbr>", "gm"), "\n")
    this.initLikeStatus(article._id)
    this.initComment(article._id)
    this.setData({
      article,
      showSkeleton: false
    })
  },

  onShow() {
    if (!this.data.userInfo) {
      this.getLocalUserInfo()
    }
  },

  async initLikeStatus(articleId) {
    const result = await Article.getLikeStatus(articleId)
    this.setData({
      likeStatus: result,
      hasLikeStatus: true
    })
  },

  async initComment(articleId) {
    const paging = await Article.getComment(articleId)
    const data = await paging.getMoreData()
    if (!data) {
      return
    }
    this.setData({
      comment: data.data,
      paging,
      totalPage: paging.totalPage,
      loadingType: data.moreData ? "loading" : "end"
    })
  },

  getLocalUserInfo() {
    const userInfo = User.getLocalUserInfo("userInfo", false)
    if (userInfo) {
      this.setData({
        userInfo
      })
    }
  },

  onLikeClicked() {
    this.getOpenerEventChannel().emit("someEvent", {
      refresh: true
    })
  },

  onShowPosting() {
    const posting = !this.data.posting
    this.setData({
      posting
    })
  },

  onSetPostedData(event) {
    const commentData = event.detail.commentData
    if (commentData) {
      this.setData({
        comment: commentData
      })
      this.data.paging.accumulator = commentData
      if (event.detail.needRefresh) {
        this.setData({
          currentPage: this.data.paging.currentPage + 1,
          totalPage: event.detail.totalPage
        })
        this.data.paging.currentPage = this.data.paging.currentPage + 1
        this.data.paging.totalPage = event.detail.totalPage
      }
    }
  },

  handleTag(tag) {
    if (tag) {
      this._setTagColor()
      if (tag.length > 3) {
        tag = tag.slice(0, 3)
      }
    }
    return tag
  },

  _setTagColor() {
    const arr = ["#574a7f", "#a2b86d", "#b95551", "#e4c374", "#2168B9", "#8e7a50", "#35323a", "#f5c5d5"]
    const result = getRandomArr(arr)
    this.setData({
      tagColor: result
    })
  }

})