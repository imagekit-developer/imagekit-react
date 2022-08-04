import React from 'react';
import ImageKitComponent from "../ImageKitComponent";

interface State {
  currentUrl?: string,
  originalSrc: any,
  lqipSrc: any,
  originalSrcLoaded: boolean,
  intersected: boolean,
  contextOptions: any
}

const propsAffectingURL = ["urlEndpoint", "path", "src", "transformation", "transformationPosition", "queryParameters"];
class IKVideo extends ImageKitComponent {
  videoRef: any = React.createRef();

  constructor(props: any, context: any) {
    super(props, context);
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

  getSrc() {
    const result: any = {};
    const { lqip, src, path, transformation, transformationPosition, queryParameters }: any = this.props;
    const ikClient = this.getIKClient();
    const contextOptions = this.getContext();

    const options = {
      urlEndpoint: this.props.urlEndpoint || contextOptions.urlEndpoint,
      src: src || contextOptions.src,
      path: path || contextOptions.path,
      transformation: transformation || contextOptions.transformation,
      transformationPosition: transformationPosition || contextOptions.transformationPosition,
      queryParameters: queryParameters || contextOptions.queryParameters
    };

    result.originalSrc = ikClient.url(options);

    if (lqip && lqip.active) {
      let quality = parseInt((lqip.quality || lqip.threshold), 10) || 20;
      let blur = parseInt((lqip.blur || lqip.blur), 10) || 6;
      let newTransformation = options.transformation ? [...options.transformation] : [];
      if (lqip.raw && typeof lqip.raw === "string" && lqip.raw.trim() != "") {
        newTransformation.push({
          raw: lqip.raw.trim()
        });
      } else {
        newTransformation.push({
          quality,
          blur
        })
      }
      result.lqipSrc = ikClient.url({
        ...options,
        transformation: newTransformation
      });
    } else {
      // TODO for lqipSrc
      result.lqipSrc = ikClient.url({
        ...options
      });
    }

    return result;
  }

  getEffectiveConnection() {
    try {
      // return navigator.connection.effectiveType;
      return undefined
    } catch (ex) {
      return "4g";
    }
  }

  updateVideoUrl() {
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
    }: any = this.state;

    const {
      lqip = null,
      loading
    }: any = this.props;

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

  triggerOriginalVideoLoad() {
    const video = new HTMLVideoElement();
    video.onload = () => {
      this.setState({ originalSrcLoaded: true }, () => {
        this.updateVideoUrl();
      });
    }
    video.src = this.state.originalSrc;
  }

  componentDidMount() {
    this.updateVideoUrl();
    this.setState({ contextOptions: this.getContext() });

    const video = this.videoRef.current;
    const { lqip, loading }: any = this.props;

    if (window && 'IntersectionObserver' in window && loading === "lazy") {
      let connectionType = this.getEffectiveConnection();
      // Values based on native lazy loading in Chrome - https://web.dev/native-lazy-loading/#improved-data-savings-and-distance-from-viewport-thresholds
      let rootMargin = "1250px";
      if (connectionType !== "4g") rootMargin = "2500px";
      const videoObserver = new IntersectionObserver(entries => {
        const el = entries[0];
        if (el && el.isIntersecting) {
          this.setState({ intersected: true }, () => {
            if (lqip && lqip.active) this.triggerOriginalVideoLoad();
            videoObserver.disconnect();
            this.updateVideoUrl();
          });
        }
      }, {
        rootMargin: `${rootMargin} 0px ${rootMargin} 0px`
      });
      videoObserver.observe(video);
      this.setState({
        observe: videoObserver
      })
    } else {
      // Load original image right away
      this.setState({ intersected: true }, () => {
        if (lqip && lqip.active) this.triggerOriginalVideoLoad();
        this.updateVideoUrl();
      });
    }
  }

  componentWillUnmount() {
    const { observe }: any = this.state;
    if (observe) observe.disconnect();
  }

  areObjectsDifferent(prevProps: any, newProps: any) {
    for (let index = 0; index < propsAffectingURL.length; index++) {
      if (prevProps[propsAffectingURL[index]] != newProps[propsAffectingURL[index]]) {
        return true;
      };
    }
    return false;
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    let contextOptions = this.getContext();

    if (
      this.areObjectsDifferent(prevProps, this.props) ||
      this.areObjectsDifferent(prevState.contextOptions, contextOptions)
    ) {
      const { originalSrc, lqipSrc } = this.getSrc();
      this.setState({ originalSrc, lqipSrc }, () => {
        this.updateVideoUrl();
        this.setState({ contextOptions: this.getContext() });
      });
    }
  }

  render() {
    let { currentUrl }: any = this.state;
    const { urlEndpoint, loading, lqip, path, src, transformation, transformationPosition, queryParameters, ...restProps }: any = this.props;

    return <video alt={this.props.alt || ""} controls width={transformation?.width} height={transformation?.height} ref={this.videoRef} {...restProps}>
      <source src={currentUrl} type="video/mp4" />
    </video>;
  }
}

export default IKVideo;