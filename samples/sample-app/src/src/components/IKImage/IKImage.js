import React from 'react';
import ImageKitComponent from "../ImageKitComponent/ImageKitComponent";
import extractImageKitProps from '../../util/extractImageKitProps';
import ImageKit from 'imagekit-javascript';

class IKImage extends ImageKitComponent {
  constructor(props, context) {
    super(props, context);
    this.imageRef = React.createRef();
    const { originalSrc, lqipSrc } = this.getSrc();
    this.state = {
      currentUrl: undefined,
      originalSrc: originalSrc,
      lqipSrc: lqipSrc,
      originalSrcLoaded: false,
      intersected: false
    };
  }

  getIKClient() {
    var contextOptions = this.getContext();
    const { urlEndpoint } = this.props;
    var ikClient = new ImageKit({
      sdkVersion: `react-${this.getVersion()}`,
      urlEndpoint: urlEndpoint || contextOptions.urlEndpoint,
    });
    return ikClient;
  }

  getSrc() {
    const result = {};
    const { lqip, src, path, transformation, transformationPosition, queryParameters } = this.props;
    var ikClient = this.getIKClient();

    var options = {
      src,
      path,
      transformation,
      transformationPosition,
      queryParameters
    };

    result.originalSrc = ikClient.url(options);

    if (lqip && lqip.active) {
      var quality = parseInt((lqip.quality || lqip.threshold), 10) || 20;
      var blur = parseInt((lqip.blur || lqip.blur), 10) || 6;
      options.transformation = options.transformation || [];
      options.transformation.push({
        quality,
        blur
      })
      result.lqipSrc = ikClient.url(options);
    }

    return result;
  }

  getEffectiveConnection() {
    try {
      return navigator.connection.effectiveType;
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
      this.setState({ originalSrcLoaded: true });
      this.updateImageUrl();
    }
    img.src = this.state.originalSrc;
  }

  componentDidMount() {
    this.updateImageUrl();
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
          this.setState({ intersected: true });
          if (lqip && lqip.active) this.triggerOriginalImageLoad();
          imageObserver.disconnect();
          this.updateImageUrl();
        }
      }, {
        rootMargin: `${rootMargin} 0px ${rootMargin} 0px`
      });
      imageObserver.observe(image);
      this.setState({
        observe: imageObserver
      })
    } else {
      // Load original image right away
      this.setState({ intersected: true });
      if (lqip && lqip.active) this.triggerOriginalImageLoad();
      this.updateImageUrl();
    }
  }

  componentwillunmount() {
    const { observe } = this.state;
    if (observe) observe.disconnect();
  }

  render() {
    let { currentUrl } = this.state;
    const props = { ...this.props };
    const { nonImageKitProps } = extractImageKitProps(props);
    const { onError } = this.props;
    return <img
      onError={(e) => { if (onError) onError(e) }}
      src={currentUrl}
      ref={this.imageRef}
      {...nonImageKitProps}
    />;
  }
}

IKImage.propTypes = ImageKitComponent.propTypes;

export default IKImage;
