// import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import test from 'ava';
import testdom from 'testdom';

// const defaultProps = {};
//
// const render = (newProps, callback) => {
//   const props = _.merge(defaultProps, newProps);
//   return React.renderComponent(React.Component(props), document.body, () => {
//     if (typeof callback === 'function') setTimeout(callback);
//   });
// };

test.before(() => {
  testdom('<html><body></body></html>');
});

// test.afterEach(() => {
//   React.unmountComponentAtNode(document.body);
//   document.body.innerHTML = '';
// });

test('should render an input', (t) => {
  const input = ReactTestUtils.findAllInRenderedTree();
  t.deepEqual(input, []);
});
