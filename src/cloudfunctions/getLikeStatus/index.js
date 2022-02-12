const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const {
    OPENID
  } = cloud.getWXContext()
  return await db.collection('like').where({
    openid: OPENID,
    target_id: event.target_id,
  }).field({
    status: true
  }).get()
}