import { buildSrc } from "@imagekit/javascript";
import React, { useContext } from "react";
import type { SrcProps } from "../interface";

import { ImageKitContext } from "../provider/ImageKit";

export type IKVideoProps = Omit<JSX.IntrinsicElements["video"], "src"> & SrcProps;

/**
 * The Video component is a wrapper around the HTML video element. It supports all the features of the HTML video element, along with additional features provided by ImageKit.
 * 
 * @example
 * ```jsx
 * import { Video } from "@imagekit/react";
 * <Video
 *  urlEndpoint="https://ik.imagekit.io/your_imagekit_id" // You can also set this in a parent ImageKitProvider component
 *  src="/default-video.mp4" // The path to the video in your ImageKit account
 *  controls
 *  width={500}
 *  height={500}
 *  transformation={[{ width: 500, height: 500 }]} // Add ImageKit transformations
 * />
 * ```
 */
export const Video = (props: IKVideoProps) => {
  const contextValues = useContext(ImageKitContext);

  // Its important to extract the ImageKit specific props from the props, so that we can use the rest of the props as is in the video element
  const { transformation = [], src = "", queryParameters, urlEndpoint, transformationPosition, ...nonIKParams } = {
    ...contextValues, // Default values from context
    ...props // Override with props
  };

  if (!urlEndpoint || urlEndpoint.trim() === "") {
    if (process.env.NODE_ENV !== "production") {
      console.error("urlEndpoint is neither provided in this component nor in the ImageKitContext.");
    }
    return null;
  }


  const finalSrc = buildSrc({
    urlEndpoint,
    src,
    transformation: [...transformation], // Do not mutate original transformation array from the props
    queryParameters
  });

  return (
    <video {...nonIKParams} src={finalSrc} />
  );
};
