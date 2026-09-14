'use strict'

const AccessService = require('../services/access.service')

class AccessController {
  signUp = async (req, res, next) => {
    try {
      const result = await AccessService.signup(req.body)
      // Express không tự gửi giá trị return về client — phải gọi res.* thì request mới kết thúc
      return res.status(result.code).json(result)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new AccessController()
