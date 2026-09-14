'use strict';

const mongoose = require('mongoose');
const { config } = require('../configs/config.mongodb');



const MONGODB_URI = process.env.MONGODB_URI;
class Database {
  constructor() {
    this.connect();
  }

  connect(type = 'mongodb') { 
    mongoose.connect(MONGODB_URI)
      .then(() => {
        console.log(`Connected to ${type} database`);
      })
      .catch((err) => {
        console.error(`Error connecting to ${type} database:`, err);
      });

  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceDB = Database.getInstance();

module.exports = instanceDB;