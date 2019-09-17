require('dotenv').config();
const express = require('express');
const app = express();
const rabbit = require('./rabbitmq');
const logger = require('./logger');
const { numberConvert, formatter } = require('./util');

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const validator = (req, res, next) => {
  if (req.headers['x-api-key'] === process.env.API_KEY) {
    next();
  } else {
    res.status(401).send('unauthorized');
  }
}

const paymentHandler = (req, res) => {
  try {
    const {
      paymentChannel:channelName,
      phoneNumber,
      message
    } = req.body;
    let amountString = formatter[channelName](message);
    if (amountString) {
      amountString = amountString.join();
      const amount = numberConvert(amountString);
      const notificationDetails = {
        channelName,
        phoneNumber,
        amount
      }
      logger.info(notificationDetails);
      rabbit.sendToQueue(channelName, Buffer.from(JSON.stringify(req.body)));
    }
  } catch (e) {
    console.error(e);
    logger.error(e);
  }
  res.status(204).send();
}

app.get('/', (req, res) => {
  res.send('Jeketibot payment service');
})
app.post('/', validator, paymentHandler);

app.use( (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
})

app.use( (err, req, res, next)  => {
  console.log(err);
  logger.error(err);
  res.status(err.status || 500);
  res.send({
    error: err
  });
})

app.listen(process.env.NODE_PORT, () => {
  console.log(`payment service is running in port ${process.env.NODE_PORT}`);
  logger.info(`payment service is running in port ${process.env.NODE_PORT}`);
})