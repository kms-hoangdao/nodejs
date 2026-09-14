'use strict';

const { Schema, Types, model } = require('mongoose'); 

const DOCUMENT_NAME = 'KeyToken';
const COLLECTION_NAME = 'keytokens';

var keyTokenSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  publicKey: {
    type: String,
    required: true
  },
  refreshToken: {
    type: [String],
    default: []
  },
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, keyTokenSchema);
