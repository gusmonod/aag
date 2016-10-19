import upload from './upload';

import bodyParser from 'body-parser';
import express from 'express';
import logger from 'winston';

import path from 'path';

const app = express();
export default app;

app.set('port', process.env.PORT || 3000);

app.use('/', express.static(path.join(__dirname, '..', '..', 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true,}));

app.use('/upload', upload);

app.use((err, req, res, next) => {
  const status = err.statusCode || err.status || 500;

  res.status(status);
  logger.error(err);

  res.end(`Error ${status}: ${err.shortMessage}`);
  next(err);
});

app.listen(app.get('port'), () => {
  logger.info(`Server started: http://localhost:${app.get('port')}/`);
});
