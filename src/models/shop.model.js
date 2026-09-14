'use strict';


const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Shop';
const COLLECTION_NAME = 'shops';

const shopSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true,
    maxLength: 150
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive']
  }, 
  verified: {
    type: Boolean,
    default: false
  },
  roles: {
    type: [String],
    default: []
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, shopSchema);