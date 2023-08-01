import React from 'react';
import ImageKitComponent from "../ImageKitComponent";
import { InferProps } from 'prop-types';
import { ImageKitContextType } from './ImageKitContextType';
import ImageKit from 'imagekit-javascript';
import { IKContextCombinedProps } from "./props"


/**
 * Provides a container for ImageKit components. Any option set in IKContext will be passed to the children.
 *
 * @example
 *<IKContext  publicKey="<public key>" urlEndpoint="url link">
 *    <!-- other tags -->
 *    <Image src={link}/>
 *</IKContext>
 */
class IKContext extends ImageKitComponent<IKContextCombinedProps> {
  static propTypes = IKContextCombinedProps;
  extractContextOptions(mergedOptions: InferProps<IKContextCombinedProps>) {
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
  }

  render() {
    const { children } = this.props;

    const mergedOptions = { ...this.getContext(), ...this.props };

    const contextOptions = this.extractContextOptions(mergedOptions);

    if (contextOptions.urlEndpoint && contextOptions.urlEndpoint.trim() !== "") {
      contextOptions.ikClient = new ImageKit({
        urlEndpoint: contextOptions.urlEndpoint,
        // @ts-ignore
        sdkVersion: "",
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

// import React, { createContext, useContext } from 'react';
// import ImageKitComponent from "../ImageKitComponent";
// import { InferProps } from 'prop-types';
// import ImageKit from 'imagekit-javascript';
// import { IKContextCombinedProps } from "./props";

// // Create the context
// const ImageKitContext = createContext<IKContextCombinedProps>({});

// /**
//  * Provides a container for ImageKit components. Any option set in IKContext will be passed to the children.
//  *
//  * @example
//  *<IKContext  publicKey="<public key>" urlEndpoint="url link">
//  *    <!-- other tags -->
//  *    <Image src={link}/>
//  *</IKContext>
//  */
// function IKContext(props: React.PropsWithChildren<IKContextCombinedProps>) {
//   const contextOptions = useContext(ImageKitContext);

//   const extractContextOptions = (mergedOptions: InferProps<IKContextCombinedProps>) => {
//     var result: IKContextCombinedProps = {};

//     const propKeys = Object.keys(IKContextCombinedProps);

//     for (var i = 0; i < propKeys.length; i++) {
//       var key = propKeys[i];
//       const value = mergedOptions[key as keyof IKContextCombinedProps];
//       if (value) {
//         result[key as keyof IKContextCombinedProps] = value;
//       }
//     }

//     return result;
//   };

//   const mergedOptions = { ...contextOptions, ...props };

//   const contextOptionsExtracted = extractContextOptions(mergedOptions);

//   if (contextOptionsExtracted.urlEndpoint && contextOptionsExtracted.urlEndpoint.trim() !== "") {
//     contextOptionsExtracted.ikClient = new ImageKit({
//       urlEndpoint: contextOptionsExtracted.urlEndpoint,
//       // @ts-ignore
//       sdkVersion: "",
//     });
//   }

//   return (
//     <ImageKitContext.Provider value={contextOptionsExtracted}>
//       {props.children}
//     </ImageKitContext.Provider>
//   );
// }

// export default IKContext;
