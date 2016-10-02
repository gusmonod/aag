const COMMENTS = [
  {
    id: 1388534400000,
    author: 'Pete Hunt',
    text: 'Hey there!',
  },
  {
    id: 1420070400000,
    author: 'Paul O’Shannessy',
    text: 'React is *great*!',
  },
  {
    id: 1420070500000,
    author: 'いこう',
    text: '私は外人です',
  },
  {
    id: 1420070600000,
    author: 'yet',
    text: 'another',
  },
];

export const getComments = () => Promise.resolve(COMMENTS);

export const addComment = (comment) => {
  COMMENTS.push(comment);
  return Promise.resolve(COMMENTS);
};
