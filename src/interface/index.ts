import type { SrcOptions } from "@imagekit/javascript";


export interface SrcProps {
    /**
     * Accepts a relative or absolute path of the resource. If a relative path is provided, it is appended to the `urlEndpoint`.
     * If an absolute path is provided, `urlEndpoint` is ignored.
     * 
     * Do not pass Next.js StaticImports (e.g., `import image from './image.jpg'`).
    */
    src: SrcOptions["src"];

    /**
     * Get your urlEndpoint from the [ImageKit dashboard](https://imagekit.io/dashboard/url-endpoints).
     * 
     * You can also set `urlEndpoint` in the `ImageKitProvider` component, which will be used as a default value for all nested Image and Video components provided by the SDK.
     * 
     * @example
     * ```jsx
     * import { ImageKitProvider, Image } from "@imagekit/react";
     * <ImageKitProvider urlEndpoint="https://ik.imagekit.io/your_imagekit_id">
     *   <Image src="/default-image.jpg" />
     * </ImageKitProvider>
     * ```
     */
    urlEndpoint?: SrcOptions["urlEndpoint"];

    /**
     * These are additional query parameters that you want to add to the final URL.
     * They can be any query parameters and not necessarily related to ImageKit.
     * This is especially useful if you want to add a versioning parameter to your URLs.
     */
    queryParameters?: SrcOptions["queryParameters"]

    /**
     * An array of objects specifying the transformations to be applied in the URL. If more than one transformation is specified, they are applied in the order they are specified as chained transformations.
     *
     * {@link https://imagekit.io/docs/transformations#chained-transformations}
     */
    transformation?: SrcOptions["transformation"];

    /**
     * By default, the transformation string is added as a `query` parameter in the URL, e.g., `?tr=w-100,h-100`.
     * If you want to add the transformation string in the path of the URL, set this to `path`, final URL will look like `https://ik.imagekit.io/your_imagekit_id/tr:w-100,h-100/default-image.jpg`.
     */
    transformationPosition?: "path" | "query";
}