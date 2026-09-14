'use strict'

const { promisify } = require('util')
const crypto = require('crypto')
const bcrypt = require('bcrypt')

const shopModel = require('../models/shop.model')
const keyTokenService = require('./keyToken.service')
const { createTokenPair } = require('../auth/authUtils')

// Bản async của generateKeyPair: chạy trên libuv threadpool, không block event loop
const generateKeyPair = promisify(crypto.generateKeyPair)

const RolesShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN'
}

class AccessService {
  static async signup({ name, email, password }) {
    try {
      // check email exist
      const holderShop = await shopModel.findOne({ email }).lean()

      if (holderShop) {
        return {
          code: 409,
          message: 'Email already exists',
          status: 'error'
        }
      }

      // create new shop
      const hashedPassword = await bcrypt.hash(password, 10)
      const newShop = await shopModel.create({
        name,
        email,
        password: hashedPassword,
        roles: [RolesShop.SHOP]
      })

      if (!newShop) {
        return {
          code: 200,
          metadata: null
        }
      }

      // create private key and public key for shop.
      // 2048-bit + async: ~230ms trên threadpool thay vì ~1-3s block main thread.
      // Khai báo encoding PEM để nhận về string, không phải KeyObject.
      const { publicKey, privateKey } = await generateKeyPair('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
      })

      const publicKeyString = await keyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey
      })

      if (!publicKeyString) {
        return {
          code: 500,
          message: 'Failed to create public key',
          status: 'error'
        }
      }

      // create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKeyString,
        privateKey
      )

      return {
        code: 201,
        message: 'User signed up successfully',
        status: 'success',
        metadata: {
          shop: newShop,
          tokens
        }
      }
    } catch (error) {
      return {
        code: 500,
        message: 'Internal server error',
        status: 'error',
        error: error.message
      }
    }
  }
}

module.exports = AccessService
