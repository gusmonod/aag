import {getComments, addComment,} from './comments';

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

// Additional middleware which will set headers that we need on each request.
app.use((req, res, next) => {
  // Set permissive CORS header - this allows this server to be used only as
  // an API server in conjunction with something like webpack-dev-server.
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Disable caching so we'll always get the latest comments.
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.get('/api/comments', async (req, res) => {
  res.json(await getComments());
});

app.post('/api/comments', async (req, res) => {
  res.json(await addComment(req.body));
});

app.listen(app.get('port'), () => {
  logger.info(`Server started: http://localhost:${app.get('port')}/`);
});
