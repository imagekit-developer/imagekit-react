import ImageKit from 'imagekit-javascript';
import PropTypes, { InferProps } from 'prop-types';
import IK_IMAGE_PROPS from "../IKImage/props";
import IK_UPLOAD_PROPS from "../IKUpload/props";
import IK_VIDEO_PROPS from "../IKUpload/props";

const Props = {
  publicKey: PropTypes.string,
  urlEndpoint: PropTypes.string,
  authenticator: PropTypes.func
};

export const IKContextCombinedProps = {
  ...Props,
  ...IK_IMAGE_PROPS,
  ...IK_UPLOAD_PROPS,
  ...IK_VIDEO_PROPS,
  ikClient: PropTypes.instanceOf(ImageKit),
};

type IKContextCombinedPropsOmit = Omit<typeof IKContextCombinedProps, "src" | "path" | "transformation"> & {
  src?: string;
  path?: string;
  transformation?: Array<string>;
};

export type IKContextCombinedProps = InferProps<IKContextCombinedPropsOmit> & {
  urlEndpoint?: string;
};

export type IKContextBaseProps = InferProps<typeof Props>;

export default Props;