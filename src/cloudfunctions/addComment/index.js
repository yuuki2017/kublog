const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const {
    OPENID
  } = cloud.getWXContext()
  try {
    await cloud.openapi.security.msgSecCheck({
      content: event.content
    })
  } catch (err) {
    if (err.errCode !== 0) {
      return {
        data: {
          msgIllegal: 1
        }
      }
    }
  }
  const latestRecord = await db.collection('comment')
    .orderBy('create_time', 'desc')
    .limit(1).get()
  await db.collection('comment').add({
    data: {
      _id: latestRecord.data[0] ? latestRecord.data[0]._id + 1 : 1,
      openid: OPENID,
      target_id: event.target_id,
      content: event.content,
      status: 1,
      create_time: db.serverDate(),
      update_time: null,
      delete_time: null,
    }
  })
  const res = await cloud.callFunction({
    name: 'getComment',
    data: {
      target_id: event.target_id,
      pageSize: event.pageSize * event.currentPage,
      currentPage: 1
    }
  })
  return res.result
}