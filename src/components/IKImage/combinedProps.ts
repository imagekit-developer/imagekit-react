import { UrlOptionsPath, UrlOptionsSrc } from "imagekit-javascript/dist/src/interfaces/UrlOptions";
import { InferProps } from "prop-types";
import COMMON_PROPS from "../IKContext/props";
import Props from "./props";

const COMBINED_IMAGE_PROP_TYPES = {
  ...COMMON_PROPS,
  ...Props,
};

type Lqip = {
  active?: boolean;
  quality?: number;
  threshold?: number;
  blur?: number;
  raw?: string;
} | null;

export type IKImageProps = Omit<InferProps<typeof COMBINED_IMAGE_PROP_TYPES>, "src" | "path" | "lqip"> &
  (UrlOptionsPath | UrlOptionsSrc) &
  React.ImgHTMLAttributes<HTMLImageElement> & {
    lqip?: Lqip;
    loading?: 'lazy';
  };

export type IKImageBaseProps = Omit<InferProps<typeof Props>, "lqip"> & {
  lqip?: Lqip;
  loading?: 'lazy';
};

export default COMBINED_IMAGE_PROP_TYPES;
