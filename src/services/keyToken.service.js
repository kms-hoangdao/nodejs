'use strict'

const keyTokenModel = require('../models/keytoken.model')

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey }) => {
    // publicKey đã là chuỗi PEM (do generateKeyPair khai báo publicKeyEncoding),
    // toString() ở đây chỉ để phòng trường hợp nhận vào Buffer/KeyObject.
    const publicKeyString = publicKey.toString()

    const keyToken = await keyTokenModel.create({
      user: userId,
      publicKey: publicKeyString
    })

    return keyToken ? keyToken.publicKey : null
  }
}

module.exports = KeyTokenService
