// import React from 'react';
// import ImageKitComponent from "../ImageKitComponent";
// import { IKContextCombinedProps } from "../IKContext/props"
// import COMBINED_PROP_TYPES, { IKImageProps } from './combinedProps';
// import { areObjectsDifferent, fetchEffectiveConnection, getIKElementsUrl, getSrc, IKImageState } from '../../utils/Utility';

// const propsAffectingURL = ["urlEndpoint", "path", "src", "transformation", "transformationPosition", "queryParameters"];
// class IKImage extends ImageKitComponent<IKImageProps> {
//   imageRef: React.RefObject<HTMLImageElement>;
//   state: IKImageState;
//   static propTypes = COMBINED_PROP_TYPES;
//   constructor(props: IKImageProps, context: any) {
//     super(props, context);
//     this.imageRef = React.createRef<HTMLImageElement>();
//     const { originalSrc, lqipSrc } = getSrc(this.props, this.getIKClient(), this.getContext());
//     this.state = {
//       currentUrl: undefined,
//       originalSrc: originalSrc,
//       lqipSrc: lqipSrc,
//       originalSrcLoaded: false,
//       intersected: false,
//       contextOptions: {}
//     };
//   }

//   updateImageUrl() {
//     const url = getIKElementsUrl(this.props, this.state);
//     this.setState({ currentUrl: url })
//   }

//   triggerOriginalImageLoad() {
//     var img = new Image();
//     img.onload = () => {
//       this.setState({ originalSrcLoaded: true }, () => {
//         this.updateImageUrl();
//       });
//     }
//     img.src = this.state.originalSrc;
//   }

//   componentDidMount() {
//     this.updateImageUrl();
//     this.setState({ contextOptions: this.getContext() });

//     const image = this.imageRef.current;
//     const { lqip, loading } = this.props;

//     if (window && 'IntersectionObserver' in window && loading === "lazy") {
//       var connectionType = fetchEffectiveConnection();
//       // Values based on native lazy loading in Chrome - https://web.dev/native-lazy-loading/#improved-data-savings-and-distance-from-viewport-thresholds
//       var rootMargin = "1250px";
//       if (connectionType !== "4g") rootMargin = "2500px";
//       const imageObserver = new IntersectionObserver(entries => {
//         const el = entries[0];
//         if (el && el.isIntersecting) {
//           this.setState({ intersected: true }, () => {
//             if (lqip && lqip.active) this.triggerOriginalImageLoad();
//             imageObserver.disconnect();
//             this.updateImageUrl();
//           });
//         }
//       }, {
//         rootMargin: `${rootMargin} 0px ${rootMargin} 0px`
//       });
//       imageObserver.observe(image!);
//       this.setState({
//         observe: imageObserver
//       })
//     } else {
//       // Load original image right away
//       this.setState({ intersected: true }, () => {
//         if (lqip && lqip.active) this.triggerOriginalImageLoad();
//         this.updateImageUrl();
//       });
//     }
//   }

//   componentWillUnmount() {
//     const { observe } = this.state;
//     if (observe) observe.disconnect();
//   }

//   componentDidUpdate(prevProps: IKImageProps, prevState: IKImageState) {
//     let contextOptions = this.getContext();

//     if (
//       areObjectsDifferent<IKImageProps>(prevProps, this.props, propsAffectingURL) ||
//       areObjectsDifferent<IKContextCombinedProps>(prevState.contextOptions, contextOptions, propsAffectingURL)
//     ) {
//       const { originalSrc, lqipSrc } = getSrc(this.props, this.getIKClient(), this.getContext());
//       this.setState({ originalSrc, lqipSrc }, () => {
//         this.updateImageUrl();
//         this.setState({ contextOptions: this.getContext() });
//       });
//     }
//   }

//   render() {
//     let { currentUrl } = this.state;
//     const { urlEndpoint, authenticationEndpoint, publicKey, loading, lqip, path, src, transformation, transformationPosition, queryParameters, ...restProps } = this.props;
//     return <img
//       alt={this.props.alt || ""}
//       src={currentUrl}
//       ref={this.imageRef}
//       {...restProps}
//     />;
//   }
// }

// export default IKImage;

import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import COMBINED_PROP_TYPES, { IKImageProps } from './combinedProps';
import { fetchEffectiveConnection, getIKElementsUrl, getSrc, IKImageState } from '../../utils/Utility';
import { ImageKitContext } from '../IKContext';
import useImageKitComponent from '../ImageKitComponent';

const IKImage = (props: IKImageProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<IKImageState>({
    currentUrl: undefined,
    originalSrc: "",
    lqipSrc: "",
    originalSrcLoaded: false,
    intersected: false,
    contextOptions: {},
    observe: undefined,
    initialzeState: false
  });

  const { getIKClient } = useImageKitComponent({ ...props })
  const contextOptions = useContext(ImageKitContext)

  const updateImageUrl = useCallback(() => {
    const url = getIKElementsUrl(props, state);
    setState((prevState) => ({ ...prevState, currentUrl: url }));
  }, [props, state]);

  const triggerOriginalImageLoad = useCallback(() => {
    var img = new Image();
    img.onload = () => {
      setState((prevState) => ({ ...prevState, originalSrcLoaded: true }));
      updateImageUrl();
    };
    img.src = state.originalSrc;
  }, [state.originalSrc, updateImageUrl]);

  useEffect(() => {
    updateImageUrl();
    setState((prevState) => ({ ...prevState, contextOptions }));

    const image = imageRef.current;
    const { lqip, loading } = props;

    if (window && 'IntersectionObserver' in window && loading === "lazy") {
      var connectionType = fetchEffectiveConnection();
      var rootMargin = "1250px";
      if (connectionType !== "4g") rootMargin = "2500px";
      const imageObserver = new IntersectionObserver(entries => {
        const el = entries[0];
        if (el && el.isIntersecting) {
          setState((prevState) => ({ ...prevState, intersected: true }));
          if (lqip && lqip.active) triggerOriginalImageLoad();
          imageObserver.disconnect();
          updateImageUrl();
        }
      }, {
        rootMargin: `${rootMargin} 0px ${rootMargin} 0px`
      });
      imageObserver.observe(image!);
      setState((prevState) => ({ ...prevState, observe: imageObserver }));
    } else {
      setState((prevState) => ({ ...prevState, intersected: true }));
      if (lqip && lqip.active) triggerOriginalImageLoad();
      updateImageUrl();
    }

    return () => {
      if (state.observe) state.observe.disconnect();
    };
  }, [contextOptions, updateImageUrl]);

  useEffect(() => {
    if (!state.initialzeState) {
      const { originalSrc, lqipSrc } = getSrc(props, getIKClient(), contextOptions);
      setState((prevState) => ({ ...prevState, originalSrc, lqipSrc }));
      updateImageUrl();
      setState((prevState) => ({ ...prevState, contextOptions, initialzeState: true }));
    }
  }, [contextOptions, getIKClient]);

  const { currentUrl } = state;
  const { urlEndpoint, authenticationEndpoint, publicKey, loading, lqip, path, src, transformation, transformationPosition, queryParameters, ...restProps } = props;

  return <img
    alt={props.alt || ""}
    src={currentUrl}
    ref={imageRef}
    {...restProps}
  />;
};

IKImage.propTypes = COMBINED_PROP_TYPES;

IKImage.defaultProps = {
  loading: "lazy",
  lqip: {
    active: true
  }
};

export default IKImage;
