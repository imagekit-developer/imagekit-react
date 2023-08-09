import { UploadResponse } from 'imagekit-javascript/dist/src/interfaces';
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
    extensions: PropTypes.arrayOf(PropTypes.object.isRequired),
    webhookUrl: PropTypes.string,
    overwriteFile: PropTypes.bool,
    overwriteAITags: PropTypes.bool,
    overwriteTags: PropTypes.bool,
    overwriteCustomMetadata: PropTypes.bool,
    customMetadata: PropTypes.any,
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
    extensions?: object[];
    webhookUrl?: string;
    overwriteFile?: boolean,
    overwriteAITags?: boolean,
    overwriteTags?: boolean,
    overwriteCustomMetadata?: boolean,
    customMetadata?: string | Record<string, string | number | boolean | Array<string | number | boolean>>;
    inputRef?: LegacyRef<HTMLInputElement>;
    onError?: (err: Error) => void;
    onSuccess?: (res: UploadResponse) => void;
    onUploadStart?: (evt: React.ChangeEvent<HTMLInputElement>) => void;
    onUploadProgress?: (evt: ProgressEvent<XMLHttpRequestEventTarget>) => void;
    validateFile?: (file: File) => boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default Props;