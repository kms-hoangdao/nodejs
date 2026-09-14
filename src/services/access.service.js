 
const shopModel = require('../models/shop.model')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const keyTokenService = require('./keyToken.service')
const { createTokenPair } = require('../auth/authUtils')

const RolesSho = {
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

      if (newShop) {
        // create private Key and public key for shop
       const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: 4096,
      })

      const publicKeyString = await keyTokenService.createKeyToken({ userId: newShop._id, publicKey })
      if (!publicKeyString) {
        return { 
          code: 500,
          message: 'Failed to create public key',
          status: 'error'
        }
      }

      //create token pair
      const tokens = await createTokenPair({ userId: newShop._id, email }, publicKeyString, privateKey)
      console.log("create Token", tokens);

      return {
        code: 201,
        message: 'User signed up successfully',
        status: 'success',
        metadata: {
          shop: newShop,
          tokens
        }
      }
    }

    return {
      code: 200,
      metadata: null,
    }

    } catch (error) {
      return { 
        code: 500,
        message: 'Internal server error',
        error: error
       }
    }
  }
}