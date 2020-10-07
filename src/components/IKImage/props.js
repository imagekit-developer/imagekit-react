import PropTypes from 'prop-types';

export default {
    loading: PropTypes.oneOf(['lazy']),
    lqip: PropTypes.object,
    path: PropTypes.string,
    src: PropTypes.string,
    queryParameters: PropTypes.object,
    transformation: PropTypes.arrayOf(PropTypes.object),
    transformationPosition: PropTypes.oneOf(['path', 'query'])
}