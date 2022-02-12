import {
  Http
} from "../utils/http"
import {
  calTimeDiff,
  getCurrentTime,
  addDays
} from "../utils/util"
import {
  Storage
} from "../utils/storage"

const storage = new Storage()

class User {
  static async addUser() {
    return await Http.request({
      name: `addUser`
    })
  }

  static async updateUser(userInfo) {
    return await Http.request({
      name: `updateUser`,
      data: {
        nickname: userInfo.nickName ? userInfo.nickName : "",
        avatar_url: userInfo.avatarUrl ? userInfo.avatarUrl : "",
        extend: JSON.stringify(userInfo)
      }
    })
  }

  static updateUserInfo(userInfo) {
    this.updateUser(userInfo)
    const timeDiff = calTimeDiff(getCurrentTime(), addDays(10) + " 0:00:00", "s")
    storage.setMyStorage("userInfo", userInfo, timeDiff)
  }

  static getLocalUserInfo(key, type) {
    return storage.getMyStorage(key, type)
  }

}

export {
  User
}