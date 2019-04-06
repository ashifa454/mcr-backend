import express from 'express';
import chalk from 'chalk';
import socketIO from 'socket.io';
import config from './config';
import mongoose from 'mongoose';
import http from 'http';

const app = express();
const server = http.createServer(app);
const isDev = process.env.NODE_ENV === 'dev';
/**
 * connect to Remote MongoDB
 */
mongoose.connect(isDev ? config.MONGO_URL : config.MONGO_URL); // We can setup different MongoDb URL for Dev and Prod
const connection = mongoose.connection;
const io = socketIO(server, {
  pingTimeout: 5000,
  pingInterval: 10000
});
/**
 * Register Schema
 */
require('../schema/room');
require('../schema/message');

connection.on('open', () => {
  /**
 * Register Socket Events
 */
  require('./socket')(io);
  server.listen(config.PORT, () => {
    const log = console.log;
    log('\n');
    log(
      chalk.bgGreen.black(
        `Server listening on http://localhost:${config.PORT}/ ..`
      )
    );
    log('\n');

    log(`${chalk.blue('Much fun! :)')}`);
    log('\n');
  });
});
connection.on('error', () => {
  console.log(chalk.red('Cannot establish connection'));
})

export default app;
