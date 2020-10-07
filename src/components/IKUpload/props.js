import PropTypes from 'prop-types';

export default {
    fileName: PropTypes.string,
    tags: PropTypes.array,
    useUniqueFileName: PropTypes.bool,
    responseFields: PropTypes.array,
    isPrivateFile: PropTypes.bool,
    folder: PropTypes.string,
    customCoordinates: PropTypes.string,
    onError: PropTypes.func,
    onSuccess: PropTypes.func
}