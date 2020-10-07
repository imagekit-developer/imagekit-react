import React from 'react';
import ImageKitComponent from "../ImageKitComponent";
import { ImageKitContextType } from './ImageKitContextType';
import ImageKit from 'imagekit-javascript';
import COMMON_PROPS from "./props"
import IK_IMAGE_PROPS from "../IKImage/props"
import IK_UPLOAD_PROPS from "../IKUpload/props"

const PROP_TYPES = {
  ...COMMON_PROPS,
  ...IK_IMAGE_PROPS,
  ...IK_UPLOAD_PROPS
};

/**
 * Provides a container for ImageKit components. Any option set in IKContext will be passed to the children.
 *
 * @example
 *<IKContext  publicKey="<public key>" urlEndpoint="url link">
 *    <!-- other tags -->
 *    <Image src={link}/>
 *</IKContext>
 */
class IKContext extends ImageKitComponent {
  extractContextOptions(mergedOptions) {
    var result = {};

    const propKeys = Object.keys(PROP_TYPES);

    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      const value = mergedOptions[key];
      if (value) result[key] = value;
    }

    return result;
  }

  render() {
    const { children } = this.props;

    const mergedOptions = { ...this.getContext(), ...this.props };

    const contextOptions = this.extractContextOptions(mergedOptions);

    if (contextOptions.urlEndpoint && contextOptions.urlEndpoint.trim() !== "") {
      contextOptions.ikClient = new ImageKit({
        sdkVersion: `react-${this.getVersion()}`,
        urlEndpoint: contextOptions.urlEndpoint
      });
    }

    return (
      <ImageKitContextType.Provider value={contextOptions}>
        {children}
      </ImageKitContextType.Provider>
    )
  }
}

IKContext.propTypes = PROP_TYPES;
IKContext.contextType = ImageKitContextType;

export default IKContext;
