import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ImageKit from 'imagekit-javascript';
import { ImageKitContextType } from '../IKContext/ImageKitContextType';
import { parseURL } from '../../util/urlParser';
const pjson = {version:1}

class ImageKitComponent extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.getContext = this.getContext.bind(this);
  }

  getVersion() {
    return "1.0.4";
  }

  getContext() {
    return this.context || {};
  }

  /**
  * Combine properties of all options to create an option Object that can be passed to Image methods.<br>
  *   `undefined` and `null` values are filtered out.
  * @protected
  * @returns {Object} option Object
  * @param options one or more options objects
  */
  static normalizeOptions(...options) {
    return options.reduce((left, right) => {
      for (let key in right) {
        let value = right[key];
        if (value !== null && value !== undefined) {
          left[key] = value;
        }
      }
      return left;
    }
      , {});
  }

  /**
   * Generate a ImageKit resource URL based on the options provided and child Transformation elements
   * @param extendedProps React props combined with custom ImageKit configuration options
   * @returns {string} a imagekit URL
   * @protected
   */
  getUrl(extendedProps) {
    const { publicKey, urlEndpoint, path, src } = extendedProps;
    const transformation = extendedProps.transformation || [];
    const transformationPosition = extendedProps.transformationPosition;
    const queryParameters = extendedProps.queryParameters;

    if (publicKey === undefined) {
      throw new Error('Missing publicKey during initialization');
    }

    if (urlEndpoint === undefined) {
      throw new Error('Missing urlEndpoint during initialization');
    }

    let newUrlEndpoint = urlEndpoint;


    if(urlEndpoint) {
      const url_params = parseURL(urlEndpoint);
      let {protocol, host, pathname } = url_params;
      pathname = pathname.slice(1);
      let leadingSlashes = pathname.match("\/+");
      if(leadingSlashes){
        pathname = pathname.replace(leadingSlashes[0],'/');
        newUrlEndpoint = `${protocol}//${host}/${pathname}`;
      }
    }

    let newPath = path;
    if(path) {
      let trailingSlashes = newPath.match("\/+");
      if(trailingSlashes){
        newPath = newPath.replace(trailingSlashes[0],'/');
      }
    }

    if (src) {
      let ik = new ImageKit({
        sdkVersion : `react-${pjson.version}`,
        publicKey: publicKey,
        urlEndpoint: newUrlEndpoint,
      });
      return ik.url({ src: src, transformation: transformation, transformationPosition: "query", queryParameters: queryParameters });
    } else if (path) {
      let ik = new ImageKit({
        sdkVersion : `react-${pjson.version}`,
        publicKey: publicKey,
        urlEndpoint: newUrlEndpoint,
      });
      return ik.url({ path: newPath, transformation: transformation, transformationPosition: transformationPosition ? transformationPosition : "path", queryParameters: queryParameters  });
    } else {
      throw new Error('Missing src / path during initialization!');
    }

  }

  /**
   * Upload a image to ImageKit cloud
   * @param file File uploaded by the input component
   * @param fileName name of the file uploaded
   * @param extendedProps React props combined with custom ImageKit configuration options
   * @returns  {Object} The object of the uploaded image
   * @protected
   */
  upload(file, fileName, useUniqueFileName, tags, folder, isPrivateFile, customCoordinates, responseFields, extendedProps, onError, onSuccess) {
    const { publicKey, urlEndpoint, authenticationEndpoint } = extendedProps;

    if (publicKey === undefined) {
      throw new Error('Missing publicKey during initialization');
    }

    if (urlEndpoint === undefined) {
      throw new Error('Missing urlEndpoint during initialization');
    }

    if (authenticationEndpoint === undefined) {
      throw new Error('Missing authenticationEndpoint during initialization');
    }

    let newUrlEndpoint = urlEndpoint;

    if(urlEndpoint) {
      const url_params = parseURL(urlEndpoint);
      let {protocol, host, pathname } = url_params;
      pathname = pathname.slice(1);
      let leadingSlashes = pathname.match("\/+");
      if(leadingSlashes){
        pathname = pathname.replace(leadingSlashes[0],'/');
        newUrlEndpoint = `${protocol}//${host}/${pathname}`;
      }
    }

    let ik = new ImageKit({
      sdkVersion : `react-${pjson.version}`,
      publicKey: publicKey,
      urlEndpoint: newUrlEndpoint,
      authenticationEndpoint: authenticationEndpoint
    });

    const params = {
      file: file,
      fileName: fileName,
      useUniqueFileName: useUniqueFileName,
      isPrivateFile: isPrivateFile,
      folder: folder,
    }
    if (tags) {
      Object.assign(params, { tags: tags });
    }

    if (customCoordinates) {
      Object.assign(params, { customCoordinates: customCoordinates });
    }

    if (responseFields) {
      Object.assign(params, { responseFields: responseFields });
    }

    ik.upload(params, function (err, result) {
      if (err) {
        if(onError){
          onError(err);
        }
      } else {
        if(onSuccess) {
          onSuccess(result);
        }
      }
    });
  }

  render() {
    return null;
  }
}

ImageKitComponent.contextType = ImageKitContextType;
ImageKitComponent.publicKey = PropTypes.string;
ImageKitComponent.urlEndpoint = PropTypes.string;
ImageKitComponent.src = PropTypes.string;
ImageKitComponent.path = PropTypes.string;
ImageKitComponent.transformation = PropTypes.object;

export default ImageKitComponent;
