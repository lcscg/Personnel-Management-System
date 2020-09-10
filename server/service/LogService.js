const LogModel = require('../db/db').LogModel

class LogService {
  static async add (content) {
    let log = new LogModel(content)
    await log.save()
  }

  static async all (condition, page, size) {
    let logs = await LogModel.find(condition, '_id nickname date host status desc').skip((page - 1) * size).sort({_id: -1}).limit(size)
    let count = await LogModel.count(condition)
    return {logs, page: {page, size, count}}
  }
}

module.exports = LogService
