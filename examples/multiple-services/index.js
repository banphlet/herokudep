'use strict'

const express = require('express')

const app = express()

app
  .get('/health', (req, res) => {
    // Perform health checks here
    res.sendStatus(200)
  })
  .get('/test-endpoint', (req, res) => {
    res.json([])
  })

app.listen(process.env.PORT)
