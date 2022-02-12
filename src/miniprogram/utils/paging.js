import {
  Http
} from "./http";

class Paging {
  totalPage
  currentPage
  pageSize
  req
  locker = false
  moreData = true
  accumulator = []

  constructor(req, pageSize = 10, currentPage = 1) {
    this.currentPage = currentPage
    this.pageSize = pageSize
    this.req = req
  }

  async getMoreData() {
    if (!this.moreData) {
      return
    }
    if (!this._getLocker()) {
      return
    }
    const data = await this._actualGetData()
    this._releaseLocker()
    return data
  }

  async _actualGetData() {
    const req = this._getCurrentReq()
    let paging = await Http.request(req)
    if (!paging) {
      return null
    }
    this.totalPage = paging.totalPage
    this.moreData = Paging._moreData(paging.totalPage, paging.currentPage)
    if (paging.totalCount === 0) {
      return {
        empty: true,
        data: [],
        moreData: false,
        accumulator: []
      }
    }
    if (this.moreData) {
      this.currentPage += 1
    }
    this._accumulate(paging.data)
    return {
      empty: false,
      data: paging.data,
      moreData: this.moreData,
      accumulator: this.accumulator
    }
  }

  _accumulate(data) {
    this.accumulator = this.accumulator.concat(data)
  }

  static _moreData(totalPage, currentPage) {
    return currentPage < totalPage
  }

  _getCurrentReq() {
    this.req.data.pageSize = this.pageSize
    this.req.data.currentPage = this.currentPage
    return this.req
  }

  _getLocker() {
    if (this.locker) {
      return false
    }
    this.locker = true
    return true
  }

  _releaseLocker() {
    this.locker = false
  }

}

export {
  Paging
}