import React from 'react';
import ImageKitComponent from "../ImageKitComponent";
import { IKContextCombinedProps } from "../IKContext/props"
import COMBINED_PROP_TYPES, { IKImageProps } from './combinedProps';
import { areObjectsDifferent, fetchEffectiveConnection, getIKElementsUrl, getSrc, IKImageState } from '../../utils/Utility';

const propsAffectingURL = ["urlEndpoint", "path", "src", "transformation", "transformationPosition", "queryParameters"];
class IKImage extends ImageKitComponent<IKImageProps> {
  imageRef: React.RefObject<HTMLImageElement>;
  state: IKImageState;
  static propTypes = COMBINED_PROP_TYPES;
  constructor(props: IKImageProps, context: any) {
    super(props, context);
    this.imageRef = React.createRef<HTMLImageElement>();
    const { originalSrc, lqipSrc } = getSrc(this.props, this.getIKClient(), this.getContext());
    this.state = {
      currentUrl: undefined,
      originalSrc: originalSrc,
      lqipSrc: lqipSrc,
      originalSrcLoaded: false,
      intersected: false,
      contextOptions: {}
    };
  }

  updateImageUrl() {
    const url = getIKElementsUrl(this.props, this.state);
    this.setState({ currentUrl: url })
  }

  triggerOriginalImageLoad() {
    var img = new Image();
    img.onload = () => {
      this.setState({ originalSrcLoaded: true }, () => {
        this.updateImageUrl();
      });
    }
    img.src = this.state.originalSrc;
  }

  componentDidMount() {
    this.updateImageUrl();
    this.setState({ contextOptions: this.getContext() });

    const image = this.imageRef.current;
    const { lqip, loading } = this.props;

    if (window && 'IntersectionObserver' in window && loading === "lazy") {
      var connectionType = fetchEffectiveConnection();
      // Values based on native lazy loading in Chrome - https://web.dev/native-lazy-loading/#improved-data-savings-and-distance-from-viewport-thresholds
      var rootMargin = "1250px";
      if (connectionType !== "4g") rootMargin = "2500px";
      const imageObserver = new IntersectionObserver(entries => {
        const el = entries[0];
        if (el && el.isIntersecting) {
          this.setState({ intersected: true }, () => {
            if (lqip && lqip.active) this.triggerOriginalImageLoad();
            imageObserver.disconnect();
            this.updateImageUrl();
          });
        }
      }, {
        rootMargin: `${rootMargin} 0px ${rootMargin} 0px`
      });
      imageObserver.observe(image!);
      this.setState({
        observe: imageObserver
      })
    } else {
      // Load original image right away
      this.setState({ intersected: true }, () => {
        if (lqip && lqip.active) this.triggerOriginalImageLoad();
        this.updateImageUrl();
      });
    }
  }

  componentWillUnmount() {
    const { observe } = this.state;
    if (observe) observe.disconnect();
  }

  componentDidUpdate(prevProps: IKImageProps, prevState: IKImageState) {
    let contextOptions = this.getContext();

    if (
      areObjectsDifferent<IKImageProps>(prevProps, this.props, propsAffectingURL) ||
      areObjectsDifferent<IKContextCombinedProps>(prevState.contextOptions, contextOptions, propsAffectingURL)
    ) {
      const { originalSrc, lqipSrc } = getSrc(this.props, this.getIKClient(), this.getContext());
      this.setState({ originalSrc, lqipSrc }, () => {
        this.updateImageUrl();
        this.setState({ contextOptions: this.getContext() });
      });
    }
  }

  render() {
    let { currentUrl } = this.state;
    const { urlEndpoint, loading, lqip, path, src, transformation, transformationPosition, queryParameters, ...restProps } = this.props;
    return <img
      alt={this.props.alt || ""}
      src={currentUrl}
      ref={this.imageRef}
      {...restProps}
    />;
  }
}

export default IKImage;
