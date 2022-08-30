import PropTypes from 'prop-types';

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

export default Props;