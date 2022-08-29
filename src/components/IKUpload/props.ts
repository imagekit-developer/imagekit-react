import PropTypes, { InferProps } from 'prop-types';
import React from 'react';

const Props = {
    fileName: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string.isRequired),
    useUniqueFileName: PropTypes.bool,
    responseFields: PropTypes.array,
    isPrivateFile: PropTypes.bool,
    folder: PropTypes.string,
    customCoordinates: PropTypes.string,
    onError: PropTypes.func,
    onSuccess: PropTypes.func
}

export type IKUploadProps = InferProps<typeof Props> & {
    useUniqueFileName?: boolean;
    tags?: Array<string>;
    folder?: string;
    isPrivateFile?: boolean;
    customCoordinates?: string;
    responseFields?: Array<string>;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default Props;