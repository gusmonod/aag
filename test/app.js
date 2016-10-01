import app from '../dist/app';
import {getComments,} from '../dist/comments';

import _ from 'lodash/fp';
import request from 'supertest';
import test from 'ava';

test('non-existing route', () => {
  request(app)
    .get('/api/whatever')
    .expect(404);
});

test('read comments', async (t) => {
  const res = await request(app).get('/api/comments');
  t.is(res.status, 200);
  t.deepEqual(JSON.parse(res.text), await getComments());
});

test('add new comment', async (t) => {
  const newComment = {
    author: 'new author',
    text: 'new text',
  };

  t.is(_.find(newComment, await getComments()), undefined);

  request(app)
    .post('/api/comments')
    .send(newComment)
    .end((err, res) => {
      t.ifError(err);

      const findComment = () => _.pipe([
        _.find(newComment),
        _.pick(['author', 'text',]),
      ]);

      const commentsWithAdded = JSON.parse(res.text);

      t.deepEqual(newComment, findComment(commentsWithAdded));
    });
});
