import React from 'react';
import ImageKitComponent from "../ImageKitComponent/ImageKitComponent";
import extractImageKitProps from '../../util/extractImageKitProps';

class IKImage extends ImageKitComponent {
  constructor(props, context) {
    super(props, context);
    this.imageRef = React.createRef();
    this.state = {};

    let state = { url: undefined };
    this.state = Object.assign(state, this.prepareState(props, context));
  }

  onError = (e) => {
	if(this.props.onError) this.props.onError(e);
  }

  onLoad = (e) => {
	if(this.props.onLoad) this.props.onLoad(e);
  }

  prepareState(props = this.props, context = this.getContext()) {
    let extendedProps = ImageKitComponent.normalizeOptions(context, props);
    let url = this.getUrl(extendedProps);

    let state = {};

    let currentState = this.state || {};

    if (url !== currentState.url) {
      state.url = url;
    }

    if(props.alt){
      state.alt = props.alt;
    }else{
      state.alt="";
    }

    return state;
  }

  lqipload(quality) {
    let url = this.state.url;
    let lqip = "";
    if (this.props.path !== undefined) {
      let newUrl = url.split("tr:");
      if (newUrl[0] === url) {
        let newUrl = url.split("/");
        newUrl = `${newUrl[0]}//${newUrl[2]}/${newUrl[3]}/tr:q-${quality}/${newUrl[4]}`;
        lqip = `${newUrl}`;
      } else {
        newUrl = `${newUrl[0]}tr:q-${quality},${newUrl[1]}`;
        lqip = `${newUrl}`;
      }
    } else {
      if(url.includes("tr")){
        lqip = `${url}&q-${quality}`;
      }
      else {
        lqip = `${url}&tr=q-${quality}`;
      }

    }
    return lqip;
  }

  componentDidMount() {
    const imageObserver = new IntersectionObserver(function (entry, observer) {
      if (entry[0].isIntersecting) {
        let image = entry[0].target;
        image.src = url;
        imageObserver.unobserve(image);
      }
    });

    const image = this.imageRef.current;
    let url = this.state.url;
    if (!image) return

    imageObserver.observe(image);

  }

  componentDidUpdate() {
    this.setState(this.prepareState());
  }

  render() {
    let { url, alt } = this.state;
    const props = { ...this.props };
    const { nonImageKitProps } = extractImageKitProps(props);
    const lqip = props.lqip;

    if (lqip !== undefined && lqip.active === true) {
      const { quality } = this.props.lqip;
      const url = this.lqipload(quality);
      return < img onLoad={this.onLoad} src={url} {...nonImageKitProps} ref={this.imageRef} alt={alt} onError={this.onError} />;
    } else {
      return < img onLoad={this.onLoad} src={url} {...nonImageKitProps} ref={this.imageRef} alt={alt} onError={this.onError} />;
    }
  }
}

IKImage.propTypes = ImageKitComponent.propTypes;

export default IKImage;
