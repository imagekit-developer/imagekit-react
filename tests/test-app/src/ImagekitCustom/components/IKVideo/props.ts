import PropTypes from 'prop-types';

const Props = {
    path: PropTypes.string,
    src: PropTypes.string,
    queryParameters: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired),
    transformation: PropTypes.arrayOf(PropTypes.object.isRequired),
    transformationPosition: PropTypes.oneOf(['path', 'query'])
};

export default Props;