import { getResponsiveImageAttributes, type GetImageAttributesOptions } from "@imagekit/javascript";
import React, { useContext } from "react";
import type { SrcProps } from "../interface";
import { ImageKitContext } from "../provider/ImageKit";

export type IKImageProps = Omit<JSX.IntrinsicElements["img"], "src" | "srcSet" | "width"> & SrcProps & Pick<GetImageAttributesOptions, "deviceBreakpoints" | "imageBreakpoints"> & {
  /**
   * Set to `false` to disable automatic responsive `srcSet` generation.
   * Defaults to `true`.
   */
  responsive?: boolean;

  /**
   * The intended display width of the image.
   *
   * - Accepts a number (e.g. `100`) or a numeric string (e.g. `"100"`).
   * - If you pass units such as `"100px"` or a percentage like `"100%"`, the value
   *   is ignored when generating the `srcSet`. In that case, a broad range of
   *   widths is produced to cover all possible viewport sizes.
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
 * A React wrapper around the native `<img>` element that adds ImageKit's
 * optimization and transformation capabilities.
 *
 * All native `<img>` props are supported, in addition to the ImageKit‑specific props.
 *
 * @example
 * ```jsx
 * import { Image } from "@imagekit/react";
 *
 * <Image
 *   urlEndpoint="https://ik.imagekit.io/your_imagekit_id" // Can also be set on a parent <ImageKitProvider />
 *   src="/default-image.jpg"                               // Path in your ImageKit account
 *   alt="Default image"
 *   width={500}
 *   height={500}
 *   transformation={[{ width: 500, height: 500 }]}         // Optional ImageKit transformations
 * />
 * ```
 */
export const Image = (props: IKImageProps) => {
  const contextValues = useContext(ImageKitContext);

  // It's important to extract the ImageKit‑specific props so we can spread the
  // remaining props directly onto the `<img>` element.
  const { transformation = [], src = "", loading = "lazy", queryParameters, urlEndpoint, transformationPosition, sizes, responsive = true, deviceBreakpoints, imageBreakpoints, ...nonIKParams } = {
    ...contextValues, // Default values from context
    ...props // Override with props
  };

  // Fail fast in development if the mandatory urlEndpoint is missing.
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
    sizes,
    queryParameters,
    urlEndpoint,
    transformationPosition,
    deviceBreakpoints,
    imageBreakpoints,
  })

  if (!responsive) {
    return (
      <img
        {...nonIKParams}
        loading={loading}
        src={newSrc}
      />
    )
  }

  return (
    <img
      {...nonIKParams}
      loading={loading}
      sizes={sizes}
      srcSet={srcSet}
      src={newSrc}
    />
  )
};
