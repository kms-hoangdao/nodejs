'use strict'

const JWT = require('jsonwebtoken')

const createTokenPair = async (payload, publicKey, privateKey) => {
  // Không bọc try/catch nuốt lỗi ở đây: nếu ký token thất bại thì signup đã hỏng,
  // phải để lỗi nổi lên cho tầng gọi quyết định, không trả về Error như giá trị hợp lệ.
  const accessToken = JWT.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: '2 days'
  })

  const refreshToken = JWT.sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: '7 days'
  })

  return { accessToken, refreshToken }
}

module.exports = { createTokenPair }
