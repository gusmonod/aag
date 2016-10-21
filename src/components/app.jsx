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
      dictFileTooBig: 'Image trop grande ({{filesize}}Mo). Taill max: {{maxFilesize}}Mo.',
      dictFallbackMessage: 'Votre navigateur ne supporte pas le téléversement avec glissement.',
      dictFallbackText: 'Veuillez utiliser le formulaire de remplacement ci-dessous pour transférer vos fichiers comme au bon vieux temps.',
      dictInvalidFileType: 'Impossible de téléverser un fichier de ce type.',
      dictResponseError: 'Le serveur a répondu avec le code {{statusCode}}.',
      dictMaxFilesExceeded: 'Vous ne pouvez pas téléverser plus de fichiers.',
      maxFilesize: 5,  // 5 MB
      filesizeBase: 1000,
      uploadMultiple: true,
      parallelUploads: 5,
    };

    this.componentConfig = {
      iconFiletypes: ['.jpg', '.png', '.gif', '.tiff', '.*',],
      showFiletypeIcon: true,
      postUrl: 'http://52.210.28.189:3000/upload',
    };

    this.eventHandlers = {
      sending: this.sending.bind(this),
      success: this.success.bind(this),
    };

    this.state = {
      email: '',
      nbSent: 0,
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
    formData.set('lastModifiedMilliTs', file.lastModified);
  }

  success() {
    const plural = this.state.nbSent ? 's' : '';
    document.getElementById('upload-success-message')
        .innerText = `${++this.state.nbSent} image${plural} envoyée${plural} avec succès`;
  }

  render() {
    return (
      <div>
        <label htmlFor='input-email'>Email&nbsp;:</label>
        <input placeholder='votre email'
               onChange={this.handleChange.bind(this)}
               value={this.state.email}
               type='email' id='input-email' name='input-email' />
        <div className={this.isEmailValid() ? 'hidden' : 'dropzone filepicker'}>
          <div className='dz-message'>Pour envoyer vos photos, saisissez votre email, on pourra vous remercier&nbsp;!</div>
        </div>
        <div className={this.isEmailValid() ? '' : 'hidden'}>
          <DropzoneComponent
              config={this.componentConfig}
              djsConfig={this.djsConfig}
              eventHandlers={this.eventHandlers}>
            <div id='upload-success-message' className='message'></div>
          </DropzoneComponent>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  React.createElement(App, null),
  document.getElementById('photos-uploader')
);
