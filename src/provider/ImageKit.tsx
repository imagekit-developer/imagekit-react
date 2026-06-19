import React, { createContext } from "react";
import type { SrcProps } from "../interface";

export type ImageKitProviderProps = React.PropsWithChildren<Pick<SrcProps, "urlEndpoint" | "transformationPosition">>;
export const ImageKitContext = createContext<ImageKitProviderProps>({});

/**
 * You can use the `ImageKitProvider` component to set the default values for all nested Image and Video components provided by the SDK.
 * 
 * It accepts the following props:
 * - `urlEndpoint`: The URL endpoint for your ImageKit account. You can get this from the [ImageKit dashboard](https://imagekit.io/dashboard/url-endpoints).
 * - `transformationPosition`: The position of the transformation string in the URL. It can be either `path` or `query`. By default, it is set to `query`.
 * 
 * @example
 * ```jsx
 * import { ImageKitProvider, Image } from "@imagekit/react";
 * <ImageKitProvider urlEndpoint="https://ik.imagekit.io/your_imagekit_id">
 *   <Image src="/default-image.jpg" />
 * </ImageKitProvider>
 * ```
 */
export const ImageKitProvider = (props: ImageKitProviderProps) => {
  const { urlEndpoint, transformationPosition } = props;
  return <ImageKitContext.Provider value={{ urlEndpoint, transformationPosition }}>{props.children}</ImageKitContext.Provider>;
};

