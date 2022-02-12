const dtime = '_expiration'

class Storage {
  constructor() {}

  setMyStorage(k, v, t) {
    if (v === '' || v === 0 || v === false) v = -1
    wx.setStorageSync(k, v)
    let seconds = parseInt(t)
    if (seconds > 0) {
      let timestamp = Date.parse(new Date())
      timestamp = timestamp / 1000 + seconds
      wx.setStorageSync(k + dtime, timestamp + "")
    } else {
      wx.removeStorageSync(k + dtime)
    }
  }

  getMyStorage(k, def) {
    const expiration = parseInt(wx.getStorageSync(k + dtime))
    if (expiration && parseInt(expiration) < Date.parse(new Date()) / 1000) {
      if (def) return def
      else return
    }
    const res = wx.getStorageSync(k)
    if (res) return res
    else return def
  }

  removeMyStorage(k) {
    wx.removeStorageSync(k)
    wx.removeStorageSync(k + dtime)
  }

  clearMyStorage() {
    wx.clearStorageSync()
  }

}

export {
  Storage
}