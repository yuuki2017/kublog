const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const $ = db.command.aggregate

exports.main = async (event, context) => {
  const currentPage = event.currentPage ? event.currentPage : 1
  const pageSize = event.pageSize ? event.pageSize : 10
  const filter = {
    target_id: event.target_id,
    status: 1
  }
  let data = await db.collection('comment').aggregate()
    .lookup({
      from: 'user',
      localField: 'openid',
      foreignField: 'openid',
      as: 'user_info',
    })
    .sort({
      create_time: -1
    })
    .project({
      "user_info.avatar_url":1,
      "user_info.nickname":1,
      target_id: 1,
      content: 1,
      status: 1,
      create_time: $.dateToString({
        date: '$create_time',
        format: '%m-%d',
        timezone: 'Asia/Shanghai'
      })
    })
    .match(filter)
    .skip((currentPage - 1) * pageSize).limit(pageSize)
    .end()
  data = data.list
  let totalCount = await db.collection('comment').where(filter).count()
  totalCount = totalCount.total
  const totalPage = totalCount === 0 ? 0 : totalCount <= pageSize ? 1 : Math.ceil(totalCount / pageSize)
  return {
    data: {
      currentPage,
      pageSize,
      totalPage,
      totalCount,
      data
    }
  }
}