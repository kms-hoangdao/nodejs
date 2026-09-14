'use strict'

const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
require('dotenv').config()
const compression = require('compression')
const app = express()

// init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// init db
require('./dbs/init.mongodb')

// init routes
app.use('/', require('./routes'))

// handle 404 - không route nào khớp thì tạo lỗi và đẩy xuống error handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.method} ${req.originalUrl}`)
  error.status = 404
  next(error)
})

// error handler - phải có đủ 4 tham số thì Express mới nhận diện là error middleware
app.use((error, req, res, next) => {
  const statusCode = error.status || 500
  return res.status(statusCode).json({
    code: statusCode,
    status: 'error',
    message: error.message || 'Internal Server Error',
    // chỉ lộ stack ngoài production
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  })
})

module.exports = app
