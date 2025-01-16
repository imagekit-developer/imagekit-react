import ImageKit from 'imagekit-javascript';
import PropTypes, { InferProps } from 'prop-types';

const Props = {
  publicKey: PropTypes.string,
  urlEndpoint: PropTypes.string,
  authenticator: PropTypes.func
};

export const ImageKitProviderProps = {
  ...Props,
  transformationPosition: PropTypes.oneOf(['path', 'query']),
};

export const ImageKitProviderExtractedProps = {
  ...ImageKitProviderProps,
  ikClient: PropTypes.instanceOf(ImageKit),
};

export type ImageKitProviderProps = InferProps<typeof ImageKitProviderProps> & {
  urlEndpoint?: string;
};

export type ImageKitProviderBaseProps = InferProps<typeof Props>;

export type ImageKitProviderExtractedProps = InferProps<typeof ImageKitProviderExtractedProps> & {
  urlEndpoint?: string;
};

export default Props;