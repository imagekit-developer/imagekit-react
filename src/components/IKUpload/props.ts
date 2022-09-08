import PropTypes, { InferProps } from 'prop-types';
import React, { LegacyRef } from 'react';

const Props = {
    fileName: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string.isRequired),
    useUniqueFileName: PropTypes.bool,
    responseFields: PropTypes.array,
    isPrivateFile: PropTypes.bool,
    folder: PropTypes.string,
    customCoordinates: PropTypes.string,
    onError: PropTypes.func,
    onSuccess: PropTypes.func,
    onUploadStart: PropTypes.func,
    onUploadProgress: PropTypes.func,
    inputRef: PropTypes.object,
    validateFile: PropTypes.func,
}

export type IKUploadProps = InferProps<typeof Props> & {
    useUniqueFileName?: boolean;
    tags?: Array<string>;
    folder?: string;
    isPrivateFile?: boolean;
    customCoordinates?: string;
    responseFields?: Array<string>;
    inputRef?: LegacyRef<HTMLInputElement>;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default Props;