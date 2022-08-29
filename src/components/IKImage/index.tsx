import React from 'react';
import ImageKitComponent from "../ImageKitComponent";
import { IKContextCombinedProps } from "../IKContext/props"
import { TransformationPosition, UrlOptions } from 'imagekit-javascript/dist/src/interfaces';
import COMBINED_PROP_TYPES, { IKImageProps } from './props';


type IKImageState = {
  currentUrl?: string;
  originalSrc: string;
  lqipSrc?: string;
  originalSrcLoaded: boolean;
  intersected: boolean;
  contextOptions: IKContextCombinedProps;
  observe?: IntersectionObserver;
}

type GetSrcReturnType = {originalSrc: string; lqipSrc?: string;};

const propsAffectingURL = ["urlEndpoint", "path", "src", "transformation", "transformationPosition", "queryParameters"];
class IKImage extends ImageKitComponent<IKImageProps> {
  static propTypes = COMBINED_PROP_TYPES;
  imageRef: React.RefObject<HTMLImageElement>;
  state: IKImageState;
  constructor(props: IKImageProps) {
    super(props);
    this.imageRef = React.createRef<HTMLImageElement>();
    const { originalSrc, lqipSrc } = this.getSrc();
    this.state = {
      currentUrl: undefined,
      originalSrc: originalSrc,
      lqipSrc: lqipSrc,
      originalSrcLoaded: false,
      intersected: false,
      contextOptions: {}
    };
  }

  getSrc(): GetSrcReturnType {
    const { lqip, src, path, transformation, transformationPosition, queryParameters } = this.props;
    var ikClient = this.getIKClient();
    const contextOptions = this.getContext();

    // @ts-ignore
    let options: UrlOptions = {
      urlEndpoint: this.props.urlEndpoint || contextOptions.urlEndpoint || undefined,
      src: src || contextOptions.src || undefined,
      path: path || contextOptions.path || undefined,
      transformation: transformation || contextOptions.transformation || [],
      transformationPosition: ((transformationPosition || contextOptions.transformationPosition || undefined) as TransformationPosition),
      queryParameters: queryParameters || contextOptions.queryParameters || {}
    };

    const result: GetSrcReturnType = {originalSrc: ikClient.url(options)};

    if (lqip && lqip.active) {
      var quality = Math.round(lqip.quality || lqip.threshold || 20);
      var blur = Math.round(lqip.blur || 6);
      var newTransformation = options.transformation ? [...options.transformation] : [];
      if (lqip.raw && typeof lqip.raw === "string" && lqip.raw.trim() != "") {
        newTransformation.push({
          raw: lqip.raw.trim()
        });
      } else {
        newTransformation.push({
          quality: String(quality),
          blur: String(blur),
        })
      }
      result.lqipSrc = ikClient.url({
        ...options,
        transformation: newTransformation
      });
    }

    return result;
  }

  getEffectiveConnection() {
    try {
      return (navigator as any).connection.effectiveType;
    } catch (ex) {
      return "4g";
    }
  }

  updateImageUrl() {
    /*
      No lazy loading no lqip
        src=originalImage
      No lazy loading lqip
        src=lqip
        src=originalImage (when loaded)
      lazy loading and no lqip
        src=''
        onIntersect:
        src=originalImage
      lazy loading and lqip
        src=lqip
        onIntersect:
        src=originalImage (when loaded)
    */

    const {
      intersected,
      originalSrcLoaded,
    } = this.state;

    const {
      lqip = null,
      loading
    } = this.props;

    if (loading !== "lazy" && lqip === null) {
      this.setState({ currentUrl: this.state.originalSrc })
    } else if (loading !== "lazy" && lqip && lqip.active) {
      if (originalSrcLoaded) {
        this.setState({ currentUrl: this.state.originalSrc })
      } else {
        this.setState({ currentUrl: this.state.lqipSrc })
      }
    } else if (loading === "lazy" && lqip === null) {
      if (intersected) {
        this.setState({ currentUrl: this.state.originalSrc })
      } else {
        this.setState({ currentUrl: "" })
      }
    } else if (loading === "lazy" && lqip && lqip.active) {
      if (intersected && originalSrcLoaded) {
        this.setState({ currentUrl: this.state.originalSrc })
      } else {
        this.setState({ currentUrl: this.state.lqipSrc })
      }
    }
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
      var connectionType = this.getEffectiveConnection();
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

  areObjectsDifferent<T>(prevProps: T, newProps: T) {
    for (let index = 0; index < propsAffectingURL.length; index++) {
      if (prevProps[propsAffectingURL[index] as keyof T] !== newProps[propsAffectingURL[index] as keyof T]) {
        return true;
      };
    }
    
    return false;
  }

  componentDidUpdate(prevProps: IKImageProps, prevState: IKImageState) {
    let contextOptions = this.getContext();

    if (
      this.areObjectsDifferent<IKImageProps>(prevProps, this.props) ||
      this.areObjectsDifferent<IKContextCombinedProps>(prevState.contextOptions, contextOptions)
    ) {
      const { originalSrc, lqipSrc } = this.getSrc();
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
