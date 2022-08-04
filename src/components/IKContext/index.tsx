import React from 'react';
import ImageKitComponent from "../ImageKitComponent";
import { ImageKitContextType } from './ImageKitContextType';
import ImageKit from 'imagekit-javascript';

import CommonProps from "../../interfaces/CommonProps"
import IKImageProps from "../../interfaces/IKImageProps"
import IKUploadProps from "../../interfaces/IKUploadProps"
import Keys from "../../utils";

interface IProps extends CommonProps, IKImageProps, IKUploadProps {
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

  extractContextOptions(mergedOptions: any) {
    let result: IProps | any = {};

    const propKeys = [...Keys("CommonProps"), ...Keys("IKImageProps"), ...Keys("IKUploadProps")]

    for (let i = 0; i < propKeys.length; i++) {
      let key = propKeys[i];
      const value = mergedOptions[key];
      if (value) result[key] = value;
    }

    return result;
  }

  render() {
    const { children }: any = this.props;

    const mergedOptions = { ...this.getContext(), ...this.props };

    const contextOptions = this.extractContextOptions(mergedOptions);

    if (contextOptions.urlEndpoint && contextOptions.urlEndpoint.trim() !== "") {
      contextOptions.ikClient = new ImageKit({
       urlEndpoint: contextOptions.urlEndpoint,
      });
    }

    return (
      <ImageKitContextType.Provider value={contextOptions}>
        {children}
      </ImageKitContextType.Provider>
    )
  }
}

export default IKContext;
