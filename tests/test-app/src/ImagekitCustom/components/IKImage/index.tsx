import React, { useContext, useEffect, useRef, useState } from 'react';
import COMBINED_PROP_TYPES, { IKImageProps } from './combinedProps';
import { fetchEffectiveConnection, getIKElementsUrl, getSrc } from '../../utils/Utility';
import { ImageKitContext } from '../IKContext';
import useImageKitComponent from '../ImageKitComponent';

const IKImage = (props: IKImageProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const { getIKClient } = useImageKitComponent({ ...props });
  const contextOptions = useContext(ImageKitContext);

  const [currentUrl, setCurrentUrl] = useState<string | undefined>(undefined);
  const [originalSrc, setOriginalSrc] = useState<string>("");
  const [lqipSrc, setLqipSrc] = useState<string>("");
  const [originalSrcLoaded, setOriginalSrcLoaded] = useState<boolean>(false);
  const [observe, setObserve] = useState<IntersectionObserver | undefined>(undefined);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [intersected, setIntersected] = useState<boolean>(false);

  useEffect(() => {
    const { originalSrc: newOriginalSrc, lqipSrc: newLqipSrc } = getSrc(props, getIKClient(), contextOptions);
    setOriginalSrc(newOriginalSrc);
    setLqipSrc(newLqipSrc ? newLqipSrc : '');
    setInitialized(true);
  }, [contextOptions, props, initialized]);

  const updateImageUrl = async () => {
    const url = await getIKElementsUrl(props, { originalSrc, lqipSrc, intersected, contextOptions, initialzeState: initialized, originalSrcLoaded, observe }); // Include intersected state
    if (url) {
      setCurrentUrl(url);
    }
  };

  const triggerOriginalImageLoad = () => {
    var img = new Image();
    img.onload = () => {
      setOriginalSrcLoaded(true);
    };
    img.src = originalSrc;
  };

  useEffect(() => {
    if (originalSrcLoaded)
      updateImageUrl();
  }, [originalSrcLoaded])

  useEffect(() => {

    const image = imageRef.current;
    const { lqip, loading } = props;

    if (initialized) {
      if (window && 'IntersectionObserver' in window && loading === "lazy") {
        const connectionType = fetchEffectiveConnection();
        let rootMargin = "1250px";
        if (connectionType !== "4g") rootMargin = "2500px";
        const imageObserver = new IntersectionObserver(entries => {
          const el = entries[0];
          if (el && el.isIntersecting && !intersected) {
            setIntersected(true);
            setObserve(prevObserver => {
              if (prevObserver) {
                prevObserver.disconnect();
              }
              return undefined;
            });
            triggerOriginalImageLoad();
            updateImageUrl();
          }
        }, {
          rootMargin: `${rootMargin} 0px ${rootMargin} 0px`
        });
        if (image) {
          imageObserver.observe(image);
          setObserve(imageObserver);
        }
      } else {
        setIntersected(true);
        triggerOriginalImageLoad();
        updateImageUrl();
      }
    }
    return () => {
      if (observe) {
        observe.disconnect();
      }
    };
  }, [props, originalSrc, lqipSrc]);

  const { urlEndpoint, authenticationEndpoint, publicKey, loading, lqip, path, src, transformation, transformationPosition, queryParameters, ...restProps } = props;

  return <img
    alt={props.alt || ""}
    src={currentUrl ? currentUrl : ''}
    ref={imageRef}
    {...restProps}
  />;
};

IKImage.propTypes = COMBINED_PROP_TYPES;

// IKImage.defaultProps = {
//   loading: "lazy",
//   lqip: {
//     active: true
//   }
// };

export default IKImage;

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