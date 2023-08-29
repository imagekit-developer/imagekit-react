
import React, { createContext } from 'react';
import { InferProps } from 'prop-types';
import ImageKit from 'imagekit-javascript';
import { IKContextCombinedProps } from "./props";

// Create the context
export const ImageKitContext = createContext<IKContextCombinedProps>({});

/**
 * Provides a container for ImageKit components. Any option set in IKContext will be passed to the children.
 *
 * @example
 *<IKContext  publicKey="<public key>" urlEndpoint="url link">
 *    <!-- other tags -->
 *    <Image src={link}/>
 *</IKContext>
 */
const IKContext = (props: React.PropsWithChildren<IKContextCombinedProps>) => {

  const extractContextOptions = (mergedOptions: InferProps<IKContextCombinedProps>) => {
    var result: IKContextCombinedProps = {};

    const propKeys = Object.keys(IKContextCombinedProps);

    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      const value = mergedOptions[key as keyof IKContextCombinedProps];
      if (value) {
        result[key as keyof IKContextCombinedProps] = value;
      }
    }

    return result;
  };

  const mergedOptions = {
    ...props
  };

  const contextOptionsExtracted = extractContextOptions(mergedOptions);

  if (contextOptionsExtracted.urlEndpoint && contextOptionsExtracted.urlEndpoint.trim() !== "") {
    contextOptionsExtracted.ikClient = new ImageKit({
      urlEndpoint: contextOptionsExtracted.urlEndpoint,
      // @ts-ignore
      sdkVersion: "",
    });
  }

  return (
    <ImageKitContext.Provider value={contextOptionsExtracted}>
      {props.children}
    </ImageKitContext.Provider>
  );
}

export default IKContext;