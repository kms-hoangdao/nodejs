'use strict';

const mongoose = require('mongoose');

const dbURI = 'mongodb://localhost:27017/nodejs';

class Database {
  constructor() {
    this.connect();
  }

  connect(type = 'mongodb') { 
    mongoose.connect(dbURI)
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