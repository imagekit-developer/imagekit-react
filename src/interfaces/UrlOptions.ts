import { TransformationPosition } from "./TransformationPosition";
import { Transformation } from "./Transformation";

export interface UrlOptionsBase {
  /**
   * An array of objects specifying the transformations to be applied in the URL.
   * The transformation name and the value should be specified as a key-value pair in each object.
   * @link https://docs.imagekit.io/features/image-transformations/chained-transformations
   */
  transformation?: Array<Transformation>;
  /**
   * Default value is path that places the transformation string as a path parameter in the URL.
   * Can also be specified as query which adds the transformation string as the query parameter tr in the URL.
   * If you use src parameter to create the URL, then the transformation string is always added as a query parameter.
   */
  transformationPosition?: TransformationPosition;
  /**
   * These are the other query parameters that you want to add to the final URL.
   * These can be any query parameters and not necessarily related to ImageKit.
   * Especially useful, if you want to add some versioning parameter to your URLs.
   */
  queryParameters?: { [key: string]: string | number };
  /**
   * The base URL to be appended before the path of the image.
   * If not specified, the URL Endpoint specified at the time of SDK initialization is used.
   */
  urlEndpoint?: string;
}

export interface UrlOptionsSrc extends UrlOptionsBase {
  /**
   * Conditional. This is the complete URL of an image already mapped to ImageKit.
   * For example, https://ik.imagekit.io/your_imagekit_id/endpoint/path/to/image.jpg.
   * Either the path or src parameter need to be specified for URL generation.
   */
  src: string;
  path?: never;
}

export interface UrlOptionsPath extends UrlOptionsBase {
  /**
   * Conditional. This is the path at which the image exists.
   * For example, /path/to/image.jpg. Either the path or src parameter need to be specified for URL generation.
   */
  path: string;
  src?: never;
}

/**
 * Options for generating an URL
 *
 * @link https://github.com/imagekit-developer/imagekit-javascript#url-generation
 */
export type UrlOptions = UrlOptionsSrc | UrlOptionsPath;
