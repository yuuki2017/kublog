const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const {
    OPENID
  } = cloud.getWXContext()
  return await db.collection('user').where({
      openid: OPENID
    }).update({
      data: {
        nickname: event.nickname,
        avatar_url: event.avatar_url,
        extend: event.extend,
        update_time: db.serverDate(),
      },
    })
}