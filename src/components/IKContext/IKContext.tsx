import React from 'react';
import { ImageKitComponent } from "../ImageKit";
import ImageKit from 'imagekit-javascript';
import { createContext } from 'react';

const ImageKitContextType = createContext<null>(null);

export class IKContext extends ImageKitComponent {

  extractContextOptions(mergedOptions: any) {
    let result: any = {};

    const propKeys = ["publicKey", "urlEndpoint", "authenticationEndpoint", "loading", "lqip", "path", "src", "queryParameters", "transformation", "transformationPosition", "fileName", "tags", "useUniqueFileName", "responseFields", "isPrivateFile", "folder", "customCoordinates", "onError", "onSuccess"]

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
