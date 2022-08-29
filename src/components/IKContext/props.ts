import ImageKit from 'imagekit-javascript';
import PropTypes, { InferProps } from 'prop-types';
import IK_IMAGE_PROPS from "../IKImage/props";
import IK_UPLOAD_PROPS from "../IKUpload/props";

const Props = {
    publicKey: PropTypes.string,
    urlEndpoint: PropTypes.string,
    authenticationEndpoint: PropTypes.string
};

export const IKContextCombinedProps = {
  ...Props,
  ...IK_IMAGE_PROPS,
  ...IK_UPLOAD_PROPS,
  ikClient: ImageKit,
};

export type IKContextCombinedProps = InferProps<typeof IKContextCombinedProps> & {
  src?: string;
  path?: string;
};

export type IKContextBaseProps = InferProps<typeof Props>;

export default Props;