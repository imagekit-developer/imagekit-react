import { buildSrc, buildTransformationString, ImageKitAbortError, ImageKitInvalidRequestError, ImageKitServerError, ImageKitUploadNetworkError, upload, getResponsiveImageAttributes } from '@imagekit/javascript';
import type { SrcOptions, Transformation, UploadOptions, UploadResponse, GetImageAttributesOptions, ResponsiveImageAttributes } from '@imagekit/javascript';

import { Image } from './components/Image';
import type { IKImageProps } from './components/Image';

import { Video } from './components/Video';
import type { IKVideoProps } from './components/Video';

import { ImageKitContext, ImageKitProvider } from "./provider/ImageKit";
import type { ImageKitProviderProps } from "./provider/ImageKit";

export { buildSrc, buildTransformationString, Image, ImageKitAbortError, ImageKitContext, ImageKitInvalidRequestError, ImageKitProvider, ImageKitServerError, ImageKitUploadNetworkError, upload, Video, getResponsiveImageAttributes };
export type {
    // React.js SDK types
    IKImageProps,
    IKVideoProps,
    ImageKitProviderProps,

    // JS SDK types
    SrcOptions,
    Transformation,
    UploadOptions,
    UploadResponse,
    GetImageAttributesOptions,
    ResponsiveImageAttributes
};
