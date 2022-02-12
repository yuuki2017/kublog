import {
  data
} from "./data.js";

Page({
  onLoad() {
    wx.lin.renderWaterFlow(data)
  }
})