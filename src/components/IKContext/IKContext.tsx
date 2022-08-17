import React from 'react';
import { ImageKitComponent } from "../ImageKit";
import ImageKit from 'imagekit-javascript';
import { createContext } from 'react';
import { IKContextType } from '../../interfaces/IKContextType';

export const ImageKitContext = createContext<IKContextType | null>(null);

export class IKContext extends ImageKitComponent {

  extractContextOptions(mergedOptions: any) {
    let result: IKContextType = {
      publicKey: '',
      urlEndpoint: '',
      authenticationEndpoint: ''
    };

    const propKeys = ["publicKey", "urlEndpoint", "authenticationEndpoint", "loading", "lqip", "path", "src", "queryParameters", "transformation", "transformationPosition", "fileName", "tags", "useUniqueFileName", "responseFields", "isPrivateFile", "folder", "customCoordinates", "onError", "onSuccess"]

    for (let i = 0; i < propKeys.length; i++) {
      let key = propKeys[i];
      const value = mergedOptions[key];
      if (value) result[key as keyof IKContextType] = value;
    }

    return result;
  }

  render() {
    const { children } = this.props;

    const mergedOptions = { ...this.getContext(), ...this.props };

    const contextOptions = this.extractContextOptions(mergedOptions);

    if (contextOptions.urlEndpoint && contextOptions.urlEndpoint.trim() !== "") {
      contextOptions.ikClient = new ImageKit({
       urlEndpoint: contextOptions.urlEndpoint,
      });
    }

    return (
      <ImageKitContext.Provider value={contextOptions}>
        {children}
      </ImageKitContext.Provider>
    )
  }
}
