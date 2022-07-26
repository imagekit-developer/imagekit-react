import { PureComponent } from 'react';
import PropTypes, { any } from 'prop-types';
import ImageKit from 'imagekit-javascript';
import { ImageKitContextType } from '../IKContext/ImageKitContextType';
// import pkg from '../../../package.json';

class ImageKitComponent extends PureComponent<any, any> {
  constructor(props: any, context: any) {
    super(props, context);
    this.getContext = this.getContext.bind(this);
  }

  // getVersion(): string {
  //   return pkg.version;
  // }

  getContext(): any {
    return this.context || {};
  }

  getIKClient() {
    const contextOptions = this.getContext();
    if (contextOptions.ikClient) {
      return contextOptions.ikClient;
    }
    var { urlEndpoint }: any = this.props;
    urlEndpoint = urlEndpoint || contextOptions.urlEndpoint;

    if(!urlEndpoint || urlEndpoint.trim() === "") {
      throw new Error("Missing urlEndpoint during initialization");
    }
    var ikClient = new ImageKit({
      urlEndpoint: urlEndpoint
    });
    return ikClient;
  }
}

ImageKitComponent.contextType = ImageKitContextType;

export default ImageKitComponent;
