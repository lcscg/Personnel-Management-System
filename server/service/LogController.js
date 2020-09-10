const logService = require('../service/LogService')

class LogController {
  static async add (content) {
    await logService.add(content)
  }

  static async all (ctx) {
    let opt = ctx.request.query
    let {page = 1, size = 10, ...condition} = opt

    let content = await logService.all(condition, Number(page), Number(size))
    ctx.success({content})
  }
}

module.exports = LogController
