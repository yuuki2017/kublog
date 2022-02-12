const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const {
    OPENID
  } = cloud.getWXContext()
  const result = await db.collection('user').where({
    openid: OPENID
  }).get()
  if (result.data.length !== 0) return result
  const latestRecord = await db.collection('user')
    .orderBy('create_time', 'desc')
    .limit(1).get()
  const uid = await db.collection('user').add({
    data: {
      _id: latestRecord.data[0] ? latestRecord.data[0]._id + 1 : 1,
      openid: OPENID,
      nickname: null,
      avatar_url: null,
      extend: null,
      create_time: db.serverDate(),
      update_time: null,
      detete_time: null,
    }
  })
  return await db.collection('user').where({_id:uid._id}).get()
}