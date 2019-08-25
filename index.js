require('dotenv').config();
const express = require('express');
const app = express();
const rabbit = require('./rabbitmq');


const validator = (req, res, next) => {
  if (req.headers['x-api-key'] === process.env.API_KEY) {
    next();
  } else {
    res.status(401).send('unauthorized');
  }
}

const paymentHandler = (req, res) => {
  try {
    const channelName = req.body.paymentChannel;
    rabbit.sendToQueue(channelName, Buffer.from(JSON.stringify(req.body)));
  } catch (e) {
    console.error(e);
  }
  res.status(204).send();
}

app.get('/', (req, res) => {
  res.send('Jeketibot payment service');
})
app.post('/', validator, paymentHandler);