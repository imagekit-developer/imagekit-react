import React, { useContext, useEffect, useRef, useState } from 'react';
import { IKContextBaseProps, IKContextCombinedProps } from "../IKContext/props";
import COMBINED_PROP_TYPES, { IKVideoProps } from './combinedProps';
import { getSrc } from '../../utils/Utility';
import useImageKitComponent from '../ImageKitComponent';
import { ImageKitContext } from '../IKContext';

export type IKVideoState = {
  currentUrl?: string;
  contextOptions: IKContextCombinedProps;
};

const IKVideo = (props: IKVideoProps & IKContextBaseProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<IKVideoState>({
    currentUrl: '',
    contextOptions: {}
  });

  const { getIKClient } = useImageKitComponent({ ...props });
  const contextItems = useContext(ImageKitContext)

  useEffect(() => {
    const { originalSrc } = getSrc(props, getIKClient(), contextItems);
    setState((prevState) => ({ ...prevState, currentUrl: originalSrc, contextOptions: contextItems }));
  }, [contextItems, props]);

  const { currentUrl } = state;

  const { urlEndpoint, publicKey, authenticationEndpoint, path, src, transformation, transformationPosition, queryParameters, ...restProps } = props;

  return (
    <video {...restProps} ref={videoRef} key={currentUrl}>
      <source src={currentUrl} type="video/mp4" />
    </video>
  );
}

IKVideo.propTypes = COMBINED_PROP_TYPES;

export default IKVideo;

// import React from 'react';
// import ImageKitComponent from "../ImageKitComponent";
// import { IKContextCombinedProps } from "../IKContext/props"
// import COMBINED_PROP_TYPES, { IKVideoProps } from './combinedProps';
// import { areObjectsDifferent, getSrc, IKImageState } from '../../utils/Utility';


// export type IKVideoState = {
//   currentUrl?: string;
//   contextOptions: IKContextCombinedProps;
// }

// const propsAffectingURL = ["urlEndpoint", "path", "src", "transformation", "transformationPosition", "queryParameters"];
// class IKVideo extends ImageKitComponent<IKVideoProps> {
//   videoRef: React.RefObject<HTMLVideoElement>;
//   state: IKVideoState;
//   static propTypes = COMBINED_PROP_TYPES;
//   constructor(props: IKVideoProps, context: any) {
//     super(props, context);
//     this.videoRef = React.createRef<HTMLVideoElement>();
//     const { originalSrc } = getSrc(this.props, this.getIKClient(), this.getContext());
//     this.state = {
//       currentUrl: originalSrc,
//       contextOptions: {}
//     };
//   }

//   componentDidMount() {
//     this.setState({ contextOptions: this.getContext() });
//   }

//   componentDidUpdate(prevProps: IKVideoProps, prevState: IKImageState) {
//     let contextOptions = this.getContext();

//     if (
//       areObjectsDifferent<IKVideoProps>(prevProps, this.props, propsAffectingURL) ||
//       areObjectsDifferent<IKContextCombinedProps>(prevState.contextOptions, contextOptions, propsAffectingURL)
//     ) {
//       const { originalSrc } = getSrc(this.props, this.getIKClient(), this.getContext());
//       this.setState({ currentUrl: originalSrc }, () => {
//         this.setState({ contextOptions: this.getContext() });
//       });
//     }
//   }

//   render() {
//     let { currentUrl } = this.state;
//     const { urlEndpoint, path, src, transformation, transformationPosition, queryParameters, ...restProps } = this.props;
//     return <video {...restProps} ref={this.videoRef}>
//       <source src={currentUrl} type="video/mp4"></source>
//     </video>;
//   }
// }

// export default IKVideo;





