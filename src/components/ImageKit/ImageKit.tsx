import { PureComponent } from 'react';
import ImageKit from 'imagekit-javascript';
import { IKContextType } from '../../interfaces/IKContextType';

type IKProps = IKContextType & {
  className?: string
  loading?: string,
  alt?: string,
  inputRef?: React.LegacyRef<HTMLInputElement>,
  width?: string,
  height?: string,
  controls?: boolean,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  enabledGif?: boolean,
  thumbnailTransformation?: any,
  onThumbnailLoad?: (thumbnail: string) => void,
  onUpload?: () => void
}

export class ImageKitComponent extends PureComponent<IKProps, any> {
  constructor(props: IKProps, context: IKContextType) {
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
