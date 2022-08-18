import React from 'react';
import { ImageKitComponent } from "../ImageKit";
import { ImageKitContext } from "../IKContext";
import { IKPropsType } from "../../interfaces/types/IKPropsType";
import { IKStateType } from "../../interfaces/types/IKStateType";
import { GetSrcReturnType } from "../../interfaces/types/GetSrcReturnType";
import { divideUrlAndQueryParams } from "../Utils/Utility";
import { fetchEffectiveConnection, 
    getIKElementsCommonOptions, 
    getLqipUrl,
    getIKElementsUrl 
} from "../Utils/Utility";

const propsAffectingURL = ["urlEndpoint", "path", "src", "transformation", "transformationPosition", "queryParameters"];

type GetSrcType = GetSrcReturnType & {
    thumbnailSrc?: string
}

type IKState = IKStateType & {
    thumbnailSrc?: string,
}

export class IKVideo extends ImageKitComponent {
    videoRef: React.RefObject<HTMLVideoElement> = React.createRef();

    state: IKState = {
        currentUrl: undefined,
        originalSrcLoaded: false,
        intersected: false,
        contextOptions: {}
    };

    constructor(props: IKPropsType, context: any) {
        super(props, context);
        const { originalSrc, lqipSrc, thumbnailSrc } = this.getSrc();
        this.state = {
            ...this.state,
            originalSrc: originalSrc,
            lqipSrc: lqipSrc,
            thumbnailSrc: thumbnailSrc
        }
    }

    getSrc(): GetSrcType {
        const result: GetSrcType = {
            originalSrc: '',
            lqipSrc: ''
        };
        const { lqip, src, path } = this.props;
        const ikClient = this.getIKClient();
        const contextOptions = this.getContext();
        const options = getIKElementsCommonOptions(this.props, contextOptions);

        result.originalSrc = ikClient.url(options);

        const urlInfoObj = divideUrlAndQueryParams(result.originalSrc);

        if (this.props.enabledGif) {
            result.originalSrc = urlInfoObj.urlStr + '/ik-gif-video.mp4' + urlInfoObj.queryParamsStr;
        }

        if (lqip && lqip.active) {
            result.lqipSrc = getLqipUrl(options, lqip, ikClient)

            const urlInfoObj = divideUrlAndQueryParams(result.lqipSrc);

            if (this.props.enabledGif) {
                result.lqipSrc = urlInfoObj.urlStr + '/ik-gif-video.mp4' + urlInfoObj.queryParamsStr;
            }
        }

        if (this.props.onThumbnailLoad) {
            result.thumbnailSrc = ikClient.url({
                urlEndpoint: this.props.urlEndpoint || contextOptions.urlEndpoint,
                src: src || contextOptions.src,
                path: path || contextOptions.path,
                transformation: this.props.thumbnailTransformation ? this.props.thumbnailTransformation : []
            });

            if (result.thumbnailSrc) {
                //Remove extra query parameters
                const urlInfoObj = divideUrlAndQueryParams(result.thumbnailSrc);
                result.thumbnailSrc = urlInfoObj.urlStr + '/ik-thumbnail.jpg' + urlInfoObj.queryParamsStr;
            }
        }

        return result;
    }

    getEffectiveConnection() {
        return fetchEffectiveConnection()
    }

    updateVideoUrl() {
        const url = getIKElementsUrl(this.props, this.state);
        this.setState({ currentUrl: url })
    }

    triggerOriginalVideoLoad() {
        const video = new HTMLVideoElement();
        video.onload = () => {
            this.setState({ originalSrcLoaded: true }, () => {
                this.updateVideoUrl();
            });
        }
        video.src = this.state.originalSrc ? this.state.originalSrc : '';
    }

    componentDidMount() {
        this.updateVideoUrl();
        this.setState({ contextOptions: this.getContext() });

        const video = this.videoRef.current;
        const { lqip, loading } = this.props;

        const { thumbnailSrc } = this.getSrc();

        if (thumbnailSrc && this.props.onThumbnailLoad) {
            let url = thumbnailSrc ? thumbnailSrc : ''
            this.props.onThumbnailLoad(url)
        }

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

            if (video) videoObserver.observe(video);

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
        const { observe } = this.state;
        if (observe) observe.disconnect();
    }

    areObjectsDifferent(prevProps: IKPropsType, newProps: IKPropsType) {
        for (let index = 0; index < propsAffectingURL.length; index++) {
            if (prevProps[propsAffectingURL[index] as keyof IKPropsType] != newProps[propsAffectingURL[index] as keyof IKPropsType]) {
                return true;
            };
        }
        return false;
    }

    componentDidUpdate(prevProps: IKPropsType, prevState: IKState) {
        let contextOptions = this.getContext();

        if (
            this.areObjectsDifferent(prevProps, this.props as IKPropsType) ||
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
        let { currentUrl } = this.state;

        return <video className={this.props.className} width={this.props.width} height={this.props.height} controls={this.props.controls}>
            <source src={currentUrl} type="video/mp4"></source>
        </video>
    }
}

IKVideo.contextType = ImageKitContext;