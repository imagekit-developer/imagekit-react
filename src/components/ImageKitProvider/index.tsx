
import React, { createContext } from 'react';
import { InferProps } from 'prop-types';
import ImageKit from 'imagekit-javascript';
import { ImageKitProviderProps, ImageKitProviderExtractedProps } from "./props";

// Create the context
export const ImageKitContext = createContext<ImageKitProviderExtractedProps>({});

/**
 * Provides a container for ImageKit components. Any option set in ImageKitProvider will be passed to the children.
 *
 * @example
 *<ImageKitProvider  publicKey="<public key>" urlEndpoint="url link">
 *    <!-- other tags -->
 *    <Image src={link}/>
 *</ImageKitProvider>
 */
const ImageKitProvider = (props: React.PropsWithChildren<ImageKitProviderProps>) => {

  const extractContextOptions = (mergedOptions: InferProps<ImageKitProviderExtractedProps>) => {
    var result: ImageKitProviderExtractedProps = {};

    const propKeys = Object.keys(ImageKitProviderExtractedProps);

    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      const value = mergedOptions[key as keyof ImageKitProviderExtractedProps];
      if (value) {
        result[key as keyof ImageKitProviderExtractedProps] = value;
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

export default ImageKitProvider;