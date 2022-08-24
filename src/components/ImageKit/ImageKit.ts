import { PureComponent } from 'react';
import ImageKit from 'imagekit-javascript';
import { IKContextType } from '../../interfaces/IKContextType'
import { IKPropsType } from '../../interfaces/types/IKPropsType';

export class ImageKitComponent extends PureComponent<IKPropsType> {
  constructor(props: IKPropsType, context: IKContextType) {
    super(props, context);
    this.getContext = this.getContext.bind(this);
  }

  getContext() {
    return this.context || {};
  }

  getIKClient() {
    const contextOptions = this.getContext();
    if (contextOptions.ikClient) {
      return contextOptions.ikClient;
    }
    let { urlEndpoint } = this.props;
    urlEndpoint = urlEndpoint || contextOptions.urlEndpoint;

    if(!urlEndpoint || urlEndpoint.trim() === "") {
      throw new Error("Missing urlEndpoint during initialization");
    }
    const ikClient = new ImageKit({
      urlEndpoint: urlEndpoint
    });
    return ikClient;
  }
}
