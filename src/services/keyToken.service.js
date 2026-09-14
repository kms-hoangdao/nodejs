const keyTokenModel = require('../models/keyToken.model');

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey }) => {
    try {
      const publicKeyString = publicKey.toString();
      const keyToken = await keyTokenModel.create({
        user: userId,
        publicKey: publicKeyString,
      });

      return keyToken ? keyToken.publicKey : null;
      
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;