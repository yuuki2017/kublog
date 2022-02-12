const getRandomArr = function (arr) {
  let result = []
  for (let i = 0; i < arr.length; i++) {
    let ran = Math.floor(Math.random() * (arr.length - i))
    if (result.includes(arr[ran])) {
      continue
    }
    result.push(arr[ran])
    arr[ran] = arr[arr.length - i - 1]
  }
  return result
}

const getCurrentTime = function getCurrentTime() {
  const startTime = new Date()
  const year = startTime.getFullYear()
  const month = startTime.getMonth() + 1 < 9 ? "0" + (startTime.getMonth() + 1) : startTime.getMonth() + 1
  const day = startTime.getDate() <= 9 ? "0" + startTime.getDate() : startTime.getDate()
  const hh = startTime.getHours()
  const mm = startTime.getMinutes() <= 9 ? "0" + startTime.getMinutes() : startTime.getMinutes()
  const ss = startTime.getSeconds() <= 9 ? "0" + startTime.getSeconds() : startTime.getSeconds()
  const correctedTime = year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss
  return correctedTime
}

const addDays = function addDays(days) {
  let nd = new Date()
  nd = nd.valueOf()
  nd = nd + days * 24 * 60 * 60 * 1000
  nd = new Date(nd)
  let y = nd.getFullYear()
  let m = nd.getMonth() + 1
  let d = nd.getDate()
  if (m <= 9) m = "" + m
  if (d <= 9) d = "" + d
  const cdate = y + "-" + m + "-" + d
  return cdate
}

const calTimeDiff = function calTimeDiff(startTime, endTime, type) {
  const ntime = new Date(startTime.replace(/\-/g, "/"))
  const nowtime = new Date(endTime.replace(/\-/g, "/"))
  const leftsecond = parseInt((nowtime.getTime() - ntime.getTime()) / 1000)
  switch (type) {
    case 'd':
      return parseInt(leftsecond / 3600 / 24)
    case 'h':
      return parseInt((leftsecond / 3600))
    case 'm':
      return parseInt((leftsecond / 60))
    case 's':
      return parseInt(leftsecond)
  }
}

const cutString = function cutString(oldStr, length) {
  return oldStr.length > length ? oldStr.substring(0, length) + "..." : oldStr
}

const calTextLength = function calTextLength(text) {
  return parseInt(text.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "1").trim().length)
}

export {
  getRandomArr,
  getCurrentTime,
  addDays,
  calTimeDiff,
  cutString,
  calTextLength
}