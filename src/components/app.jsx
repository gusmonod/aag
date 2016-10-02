import React from 'react';
import ReactDOM from 'react-dom';

class CommentBox extends React.Component {
  render() {
    return (
      <div className="commentBox">
        Hello, world! I am a CommentBox.
      </div>
    );
  }
}

ReactDOM.render(
  React.createElement(CommentBox, null),
  document.getElementById('content')
);
