import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ImageKit from 'imagekit-javascript';
import { ImageKitContextType } from '../IKContext/ImageKitContextType';
import pkg from '../../../package.json';

class ImageKitComponent extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.getContext = this.getContext.bind(this);
  }

  getVersion() {
    return pkg.version;
  }

  getContext() {
    return this.context || {};
  }

  getIKClient() {
    const contextOptions = this.getContext();
    if (contextOptions.ikClient) {
      return contextOptions.ikClient;
    }
    var { urlEndpoint } = this.props;
    urlEndpoint = urlEndpoint || contextOptions.urlEndpoint;

    if(!urlEndpoint || urlEndpoint.trim() === "") {
      throw new Error("Missing urlEndpoint during initialization");
    }
    var ikClient = new ImageKit({
      sdkVersion: `react-${this.getVersion()}`,
      urlEndpoint: urlEndpoint
    });
    return ikClient;
  }

  render() {
    return null;
  }
}

ImageKitComponent.contextType = ImageKitContextType;

export default ImageKitComponent;
