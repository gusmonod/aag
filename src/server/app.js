import upload from './upload';

import express from 'express';
import logger from 'winston';

const app = express();
export default app;

app.set('port', process.env.PORT || 3000);

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {'timestamp':true,});

app.use((req, res, next) => {  // eslint-disable-line no-unused-vars
  res.header('Access-Control-Allow-Origin', 'angeleandgus.com');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
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

app.listen(app.get('port'), () => {
  logger.info(`Server started: http://localhost:${app.get('port')}/`);
});
