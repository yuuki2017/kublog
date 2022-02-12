import {
  Http
} from "../utils/http"

class Category {
  static async getArticleCategories() {
    return await Http.request({
      name: `getArticleCategories`
    })
  }
}

export {
  Category
}