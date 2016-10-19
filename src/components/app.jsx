import React from 'react';
import ReactDOM from 'react-dom';
import DropzoneComponent from 'react-dropzone-component';

export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);

    // For a full list of possible configurations,
    // please consult http://www.dropzonejs.com/#configuration
    this.djsConfig = {
      addRemoveLinks: false,
      acceptedFiles: 'image/*',
      dictDefaultMessage: 'Glissez vos images dans cette zone ou cliquez pour les envoyer',
      maxFilesize: 5 * 1024,  // 5 GiB
      filesizeBase: 1024,
      uploadMultiple: true,
      parallelUploads: 5,
    };

    this.componentConfig = {
      iconFiletypes: ['.jpg', '.png', '.gif', '.tiff', '.*',],
      showFiletypeIcon: true,
      postUrl: '/upload',
    };

    this.eventHandlers = {
      sending: this.sending.bind(this),
    };

    this.state = {
      email: '',
    };
  }

  handleChange(event) {
    this.setState({email: event.target.value,});
  }

  isEmailValid() {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(this.state.email);
  }

  sending(file, xhr, formData) {
    formData.set('email', this.state.email);
  }

  render() {
    const config = this.componentConfig;
    const djsConfig = this.djsConfig;
    const eventHandlers = this.eventHandlers;

    return (
      <div>
        <label htmlFor='input-email'>Email&nbsp;:</label>
        <input placeholder='votre email'
               onChange={this.handleChange.bind(this)}
               value={this.state.email}
               type='email' id='input-email' name='input-email' />
        <div className={this.isEmailValid() ? 'hidden' : 'dropzone filepicker'}>
          <div className='dz-message'>Saisissez votre email</div>
        </div>
        <div className={this.isEmailValid() ? '' : 'hidden'}>
          <DropzoneComponent config={config} djsConfig={djsConfig}
                             eventHandlers={eventHandlers} />
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  React.createElement(App, null),
  document.getElementById('photos-uploader')
);
