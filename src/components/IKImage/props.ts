import { UrlOptionsPath, UrlOptionsSrc } from 'imagekit-javascript/dist/src/interfaces/UrlOptions';
import PropTypes, { InferProps } from 'prop-types';
import COMMON_PROPS from "../IKContext/props"

const Props = {
    loading: PropTypes.oneOf(['lazy']),
    lqip: PropTypes.shape({
        active: PropTypes.bool,
        quality: PropTypes.number,
        threshold: PropTypes.number,
        blur: PropTypes.number,
        raw: PropTypes.string,
    }),
    path: PropTypes.string,
    src: PropTypes.string,
    queryParameters: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired),
    transformation: PropTypes.arrayOf(PropTypes.object.isRequired),
    transformationPosition: PropTypes.oneOf(['path', 'query'])
};

const COMBINED_PROP_TYPES = {
  ...COMMON_PROPS,
  ...Props
};

export type IKImageProps = Omit<InferProps<typeof COMBINED_PROP_TYPES>, 'src' | 'path'> & (UrlOptionsPath | UrlOptionsSrc) & React.ImgHTMLAttributes<HTMLImageElement>;

export default COMBINED_PROP_TYPES;