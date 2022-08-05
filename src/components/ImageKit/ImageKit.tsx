import { PureComponent } from 'react';
import ImageKit from 'imagekit-javascript';

export class ImageKitComponent extends PureComponent<any, any> {
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
    let { urlEndpoint }: any = this.props;
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
