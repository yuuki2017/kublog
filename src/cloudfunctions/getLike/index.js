const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const $ = db.command.aggregate
const _ = db.command

exports.main = async (event, context) => {
  const currentPage = event.currentPage ? event.currentPage : 1
  const pageSize = event.pageSize ? event.pageSize : 10
  const {
    OPENID
  } = cloud.getWXContext()
  const filter = {
    openid: OPENID,
    status: 1,
    article: _.elemMatch({
      status: _.eq(1),
    })
  }
  let data = await db.collection('like').aggregate()
    .lookup({
      from: 'article',
      let: {
        target_id: '$target_id',
        article_status: 1
      },
      pipeline: $.pipeline()
        .match(_.expr($.and([
          $.eq(['$_id', '$$target_id']),
          $.eq(['$status', '$$article_status'])
        ])))
        .done(),
      as: 'article',
    })
    .match(filter)
    .project({
      target_id: 1,
      create_time: $.dateToString({
        date: '$create_time',
        format: '%Y-%m-%d %H:%M:%S'
      }),
      "article._id": 1,
      "article.title": 1,
      "article.content": 1,
      "article.tag": 1,
      "article.synopsis": 1,
      "article.main_img_url": 1,
      "article.type": 1,
      "article.category_id": 1,
      "article.status": 1,
      "article.create_time": $.dateToString({
        date: '$create_time',
        format: '%Y-%m-%d %H:%M:%S'
      })
    })
    .sort({
      create_time: -1
    })
    .skip((currentPage - 1) * pageSize).limit(pageSize)
    .end()
  data = data.list
  let totalCount = await db.collection('like').aggregate()
    .lookup({
      from: 'article',
      let: {
        target_id: '$target_id',
        article_status: 1
      },
      pipeline: $.pipeline()
        .match(_.expr($.and([
          $.eq(['$_id', '$$target_id']),
          $.eq(['$status', '$$article_status'])
        ])))
        .done(),
      as: 'article',
    })
    .match(filter)
    .count('total')
    .end()
  totalCount = totalCount.list[0] ? totalCount.list[0].total : 0
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