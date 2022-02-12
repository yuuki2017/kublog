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
  const regExp = {
    regexp: '.*' + event.keyword,
    options: 'i',
  }
  const filter = _.or([{
      title: db.RegExp(regExp)
    },
    {
      author: db.RegExp(regExp)
    },
    {
      synopsis: db.RegExp(regExp)
    },
    {
      content: db.RegExp(regExp)
    },{
      tag: _.elemMatch(_.eq(event.keyword))
    }
  ])
  let data = await db.collection('article').aggregate()
    .project({
      title: 1,
      content: 1,
      tag: 1,
      synopsis: 1,
      main_img_url: 1,
      type: 1,
      category_id: 1,
      status: 1,
      create_time: $.dateToString({
        date: '$create_time',
        format: '%Y-%m-%d %H:%M',
        timezone: 'Asia/Shanghai'
      })
    })
    .match(filter)
    .sort({
      create_time: -1
    })
    .skip((currentPage - 1) * pageSize).limit(pageSize)
    .end()
  data = data.list
  let totalCount = await db.collection('article').where(filter).count()
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