import { UrlOptionsPath, UrlOptionsSrc } from 'imagekit-javascript/dist/src/interfaces/UrlOptions';
import { InferProps } from 'prop-types';
import COMMON_PROPS from "../IKContext/props";
import Props from './props';

const COMBINED_IMAGE_PROP_TYPES = {
    ...COMMON_PROPS,
    ...Props
  };
  
  export type IKVideoProps = Omit<InferProps<typeof COMBINED_IMAGE_PROP_TYPES>, 'src' | 'path'> & (UrlOptionsPath | UrlOptionsSrc) & React.VideoHTMLAttributes<HTMLVideoElement>;
  export type IKVideoBaseProps = InferProps<typeof Props>;
  
  export default COMBINED_IMAGE_PROP_TYPES;