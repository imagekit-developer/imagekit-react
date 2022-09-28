import React, { PureComponent } from 'react';
import ImageKit from 'imagekit-javascript';
import { ImageKitContextType } from '../IKContext/ImageKitContextType';
import { IKContextBaseProps } from '../IKContext/props';

class ImageKitComponent<T = void> extends PureComponent<React.PropsWithChildren & IKContextBaseProps & T> {
  constructor(props: React.PropsWithChildren & T, context: any) {
    super(props, context);
    this.getContext = this.getContext.bind(this);
  }
  static contextType = ImageKitContextType;
  context!: React.ContextType<typeof ImageKitContextType>;

  getContext() {
    return this.context || {};
  }

  getIKClient(): ImageKit {
    const contextOptions = this.getContext();
    if (contextOptions.ikClient) {
      return contextOptions.ikClient;
    }
    let { urlEndpoint }: {urlEndpoint?: string | null} = this.props;
    urlEndpoint = urlEndpoint || contextOptions.urlEndpoint;

    if(!urlEndpoint || urlEndpoint.trim() === "") {
      throw new Error("Missing urlEndpoint during initialization");
    }
    var ikClient = new ImageKit({
      urlEndpoint: urlEndpoint,
      // @ts-ignore
      sdkVersion: "",
    });
    return ikClient;
  }

  render(): any {
    return null;
  }
}

export default ImageKitComponent;
