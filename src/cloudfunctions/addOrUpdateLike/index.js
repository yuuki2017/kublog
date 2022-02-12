const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const {
    OPENID
  } = cloud.getWXContext()
  const result = await db.collection('like').where({
    openid: OPENID,
    target_id: event.target_id
  }).get()
  if (result.data.length === 0) {
    const latestRecord = await db.collection('like')
      .orderBy('create_time', 'desc')
      .limit(1).get()
    await db.collection('like').add({
      data: {
        _id: latestRecord.data[0] ? latestRecord.data[0]._id + 1 : 1,
        openid: OPENID,
        target_id: event.target_id,
        status: event.status,
        create_time: db.serverDate(),
        update_time: null,
        detete_time: null,
      }
    })
    return {
      data: {
        likeStatus: event.status
      }
    }
  } else {
    await db.collection('like').where({
      openid: OPENID,
      target_id: event.target_id,
    }).update({
      data: {
        status: event.status,
        update_time: db.serverDate(),
      }
    })
    return {
      data: {
        likeStatus: event.status
      }
    }
  }
}