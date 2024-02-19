import ImageKit from 'imagekit-javascript';
import PropTypes, { InferProps } from 'prop-types';

const Props = {
  publicKey: PropTypes.string,
  urlEndpoint: PropTypes.string,
  authenticator: PropTypes.func
};

export const IKContextProps = {
  ...Props,
  transformationPosition: PropTypes.oneOf(['path', 'query']),
};

export const IKContextExtractedProps = {
  ...IKContextProps,
  ikClient: PropTypes.instanceOf(ImageKit),
};

export type IKContextProps = InferProps<typeof IKContextProps> & {
  urlEndpoint?: string;
};

export type IKContextBaseProps = InferProps<typeof Props>;

export type IKContextExtractedProps = InferProps<typeof IKContextExtractedProps> & {
  urlEndpoint?: string;
};

export default Props;