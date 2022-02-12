import {
  Article
} from "../../models/article"
import {
  calTextLength
} from "../../utils/util"

Component({
  properties: {
    targetId: Number,
    pageSize: Number,
    currentPage: Number,
    totalPage: Number,
    totalCount: Number
  },

  data: {
    comment: '',
    currentLength: 0,
    loading: false,
    bottom: 0,
    canPost: false,
    modifyCurrentPage: true
  },

  methods: {
    preventTouchMove() {},

    onFocus(event) {
      const currentHeight = event.detail.height
      this.setData({
        bottom: currentHeight
      })
      if (this.data.bottom != currentHeight) {
        this.setData({
          bottom: currentHeight
        })
      }
    },

    onBlur() {
      this.setData({
        bottom: 0
      })
    },

    onInput(event) {
      const comment = event.detail.value
      const commentNoSpace = String(comment).replace(/\n/g, '')
      this.data.comment = commentNoSpace
      this._handleCurrentLength(commentNoSpace)
      this._canClickPostButton(commentNoSpace)
    },

    onCancel() {
      this._handleCancel()
    },

    async onPost() {
      this.triggerEvent('cancelPost', {}, {})
      if (this.isLocked()) return
      this.locked()
      const commentNoSpace = this.data.comment
      const checkResult = this._checkComment(commentNoSpace, 80, 5)
      if (!checkResult) {
        this.unlocked()
        return
      }
      await this._postComment(commentNoSpace)
      this.unlocked()
    },

    _checkComment(comment, commentMaxLen, commentMinLen) {
      const commentLength = parseInt(comment.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "1").trim().length)
      if (!comment || comment === undefined || commentLength === 0) {
        wx.showToast({
          title: '评论不能为空！',
          icon: 'none'
        })
        return false
      }
      if (commentLength < commentMinLen) {
        wx.showToast({
          title: `评论最少${commentMinLen}个字哦！`,
          icon: 'none'
        })
        return false
      }
      if (commentLength > commentMaxLen) {
        wx.showToast({
          title: `评论最多${commentMaxLen}个字哦！`,
          icon: 'none'
        })
        return false
      } else return true
    },


    async _postComment(comment) {
      let modifyCurrentPage = false
      const res = this._initCurrentPage()
      if (res.needModify) {
        modifyCurrentPage = true
      }
      const result = await Article.postComment(this.properties.targetId, comment, this.properties.pageSize, res.currentPage)
      if (result) {
        if (result.msgIllegal === 1) {
          wx.showToast({
            title: '评论含有敏感内容，请修改后提交！',
            icon: "none",
            duration: 1500,
            mask: true
          })
          return
        }
        this._commentSuccessed(result, modifyCurrentPage)
      }
    },

    _initCurrentPage() {
      const result = this.properties.totalCount === this.properties.pageSize * this.properties.currentPage && this.properties.totalPage === this.properties.currentPage
      return {
        needModify: result,
        currentPage: result ? this.properties.currentPage + 1 : this.properties.currentPage
      }
    },

    _commentSuccessed(result, modifyCurrentPage) {
      wx.showToast({
        title: '发表成功！',
        icon: "none",
        duration: 1500,
        mask: true
      })
      this.triggerEvent('setPostedData', {
        totalPage: result.totalPage,
        commentData: result.data,
        needRefresh: result.totalCount === result.pageSize || modifyCurrentPage ? true : false
      }, {})
    },

    _handleCancel() {
      if (this.data.currentLength != 0) {
        wx.lin.showDialog({
          type: "confirm",
          title: "提示",
          content: "是否放弃已输入的内容？",
          success: (res) => {
            if (res.confirm) {
              this.triggerEvent('cancelPost', {}, {})
            } else if (res.cancel) {
              return
            }
          }
        })
      } else {
        this.triggerEvent('cancelPost', {}, {})
      }
    },

    _handleCurrentLength(comment) {
      const commentLength = calTextLength(comment)
      this.setData({
        currentLength: commentLength
      })
    },

    _canClickPostButton(comment) {
      let commentLength = comment.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "1")
      if (!comment || commentLength.trim().length === 0 || commentLength.trim().length > 80 || commentLength.trim().length < 5) {
        this.setData({
          canPost: false
        })
      } else {
        this.setData({
          canPost: true
        })
      }
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

  }
})