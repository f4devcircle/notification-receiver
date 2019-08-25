const amqplib = require('amqplib');
const credentials = amqplib.credentials.plain('guest', 'guest')

const getConnection = async () => {
  try {
    const connect = amqplib.connect('amqp://localhost', credentials);
    const connection = await connect;
    const ch = await connection.createChannel();
    return ch;
  } catch (e) {
    console.error(e);
  }
}

module.exports = getConnection;