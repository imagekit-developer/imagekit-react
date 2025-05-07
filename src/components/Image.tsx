import { getResponsiveImageAttributes } from "@imagekit/javascript";
import React, { useContext } from "react";
import type { SrcProps } from "../interface";
import { ImageKitContext } from "../provider/ImageKit";

export type IKImageProps = Omit<JSX.IntrinsicElements["img"], "src" | "srcSet" | "width"> & SrcProps & {
  /**
   * Set to `false` to disable responsive srcset generation. By default, this is `true`.
   */
  responsive?: boolean;

  /**
   * The width of the image. This is used to calculate the srcset for responsive images. Provide in number or string format e.g. 100, "100".
   * If values like "100px" or "100%" are provided, srcset calculation will ignore the value of width and generate a much larger srcset to cater to all possible widths.
   */
  width?: number | `${number}`;
}

function getInt(x: unknown): number {
  if (typeof x === 'undefined') {
    return NaN
  }
  if (typeof x === 'number') {
    return Number.isFinite(x) ? x : NaN
  }
  if (typeof x === 'string' && /^[0-9]+$/.test(x)) {
    return parseInt(x, 10)
  }
  return NaN
}



/**
 * The Image component is a wrapper around the Next.js Image component. It supports all the features of the Next.js Image component, along with additional features provided by ImageKit.
 * 
 * @example
 * ```jsx
 * import { Image } from "@imagekit/react";
 * <Image
 *  urlEndpoint="https://ik.imagekit.io/your_imagekit_id" // You can also set this in a parent ImageKitProvider component
 *  src="/default-image.jpg" // The path to the image in your ImageKit account
 *  alt="Default Image"
 *  width={500}
 *  height={500}
 *  transformation={[{ width: 500, height: 500 }]} // Add ImageKit transformations
 * />
 * ```
 */
export const Image = (props: IKImageProps) => {
  const contextValues = useContext(ImageKitContext);

  // Its important to extract the ImageKit specific props from the props, so that we can use the rest of the props as is in the img element
  const { transformation = [], src = "", loading = "lazy", queryParameters, urlEndpoint, transformationPosition, responsive = true, ...nonIKParams } = {
    ...contextValues, // Default values from context
    ...props // Override with props
  };

  if (!urlEndpoint || urlEndpoint.trim() === "") {
    if (process.env.NODE_ENV !== "production") {
      console.error("urlEndpoint is neither provided in this component nor in the ImageKitContext.");
    }
    return null;
  }

  const widthInt = getInt(nonIKParams.width);

  const { src: newSrc, srcSet } = getResponsiveImageAttributes({
    src,
    transformation,
    width: isNaN(widthInt) ? undefined : widthInt,
    sizes: nonIKParams.sizes,
    queryParameters,
    urlEndpoint,
    transformationPosition
  })

  if (!responsive) {
    <img
      loading={loading}
      {...nonIKParams}
      src={newSrc}
    />
  }

  return (
    <img
      loading={loading}
      {...nonIKParams}
      srcSet={srcSet}
      src={newSrc}
    />
  )
};
