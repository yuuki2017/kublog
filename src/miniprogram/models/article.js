import {
  Paging
} from "../utils/paging"
import {
  Http
} from "../utils/http"

class Article {
  static getArticlesByTypeAndCategory(typeId, categoryId) {
    return new Paging({
      name: `getArticlesByTypeAndCategory`,
      data: {
        typeId,
        categoryId
      }
    }, 10, 1)
  }

  static getLike() {
    return new Paging({
      name: `getLike`,
      data: {}
    }, 10, 1)
  }

  static async getLikeStatus(articleId) {
    const result = await Http.request({
      name: `getLikeStatus`,
      data: {
        target_id: articleId
      }
    })
    return result[0] ? (result[0].status === 0 ? false : true) : false
  }

  static async like(like_or_cancel, articleId) {
    return await Http.request({
      name: `addOrUpdateLike`,
      data: {
        target_id: articleId,
        status: like_or_cancel === "cancel" ? 0 : 1
      }
    })
  }

  static getSearch(keyword) {
    return new Paging({
      name: `getSearch`,
      data: {
        keyword
      }
    }, 10, 1)
  }

  static getComment(articleId) {
    return new Paging({
      name: `getComment`,
      data: {
        target_id: articleId
      }
    }, 10, 1)
  }

  static async postComment(targetId, content, pageSize, currentPage) {
    return await Http.request({
      name: `addComment`,
      data: {
        target_id: targetId,
        content,
        pageSize,
        currentPage
      }
    })
  }
}

export {
  Article
}