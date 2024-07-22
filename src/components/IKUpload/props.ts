import { UploadResponse } from 'imagekit-javascript/dist/src/interfaces';
import PropTypes, { InferProps } from 'prop-types';
import React from 'react';

type TransformationObject = {
  type: "transformation";
  value: string;
};

type GifToVideoObject = {
  type: "gif-to-video";
  value?: string;
};

type ThumbnailObject = {
  type: "thumbnail";
  value?: string;
};

type ABSObject = {
  type: "abs";
  value: string;
  protocol: "hls" | "dash";
};

type PostTransformation = TransformationObject | GifToVideoObject | ThumbnailObject | ABSObject;

type TransformationType = {
  pre?: string;
  post?: PostTransformation[];
};

interface BgRemoval {
  name: string
  options?: {
    bg_color?: string
    bg_image_url?: string
    add_shadow?: boolean
    semitransparency?: boolean
  }
}

interface AutoTag {
  name: string
  maxTags: number
  minConfidence: number
}

export type Extension = (BgRemoval | AutoTag)[];

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
    customMetadata: PropTypes.oneOf([PropTypes.string, PropTypes.object]),
    onError: PropTypes.func,
    onSuccess: PropTypes.func,
    onUploadStart: PropTypes.func,
    onUploadProgress: PropTypes.func,
    validateFile: PropTypes.func,
    ref: PropTypes.any,
    transformation: PropTypes.object,
    overrideParameters: PropTypes.func,
    checks: PropTypes.string
}

export type OverrideValues = {
  fileName?: IKUploadProps['fileName'];
  useUniqueFileName?: IKUploadProps['useUniqueFileName'];
  tags?: IKUploadProps['tags'];
  folder?: IKUploadProps['folder'];
  isPrivateFile?: IKUploadProps['isPrivateFile'];
  customCoordinates?: IKUploadProps['customCoordinates'];
  extensions?: IKUploadProps['extensions'];
  webhookUrl?: IKUploadProps['webhookUrl'];
  overwriteFile?: IKUploadProps['overwriteFile'];
  overwriteAITags?: IKUploadProps['overwriteAITags'];
  overwriteTags?: IKUploadProps['overwriteTags'];
  overwriteCustomMetadata?: IKUploadProps['overwriteCustomMetadata'];
  customMetadata?: IKUploadProps['customMetadata'];
  transformation?: IKUploadProps['transformation'];
  checks?: IKUploadProps['checks'];
};

export type IKUploadProps = Omit<InferProps<typeof Props>, "customMetadata" | "transformation"> & {
    useUniqueFileName?: boolean;
    tags?: Array<string>;
    folder?: string;
    isPrivateFile?: boolean;
    customCoordinates?: string;
    responseFields?: Array<string>;
    extensions?: Extension;
    webhookUrl?: string;
    overwriteFile?: boolean,
    overwriteAITags?: boolean,
    overwriteTags?: boolean,
    overwriteCustomMetadata?: boolean,
    customMetadata?: string | Record<string, string | number | boolean | Array<string | number | boolean>>;
    onError?: (err: Error) => void;
    onSuccess?: (res: UploadResponse) => void;
    onUploadStart?: (evt: React.ChangeEvent<HTMLInputElement>) => void;
    onUploadProgress?: (evt: ProgressEvent<XMLHttpRequestEventTarget>) => void;
    validateFile?: (file: File) => boolean;
    transformation?: TransformationType;
    overrideParameters?: (file: File) => OverrideValues;
    checks?: string
} & React.InputHTMLAttributes<HTMLInputElement>;

export default Props;