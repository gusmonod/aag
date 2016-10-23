import upload from './upload';

import express from 'express';
import fs from 'fs';
import https from 'https';
import logger from 'winston';

const app = express();
export default app;

app.set('port', process.env.PORT || 3000);

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {'timestamp':true,});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://angeleandgus.com');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Cache-Control, X-Requested-With');

  next();
});

app.use('/upload', upload);

app.use((err, req, res, next) => {
  const status = err.statusCode || err.status || 500;

  res.status(status);
  const ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  logger.error(`ip: ${ip} err: ${err}`);

  res.end(`Error ${status}: ${err.shortMessage}`);
  next(err);
});

https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/live/angeleandgus.tk/privkey.pem', 'utf8'),
  cert: fs.readFileSync('/etc/letsencrypt/live/angeleandgus.tk/cert.pem', 'utf8'),
}, app).listen(443);
