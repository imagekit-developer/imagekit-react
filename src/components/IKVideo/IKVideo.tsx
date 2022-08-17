import React from 'react';
import { ImageKitComponent } from "../ImageKit";
import { ImageKitContext } from "../IKContext";
import { IKPropsType } from "../../interfaces/types/IKPropsType";
import { IKStateType } from "../../interfaces/types/IKStateType";
import { GetSrcReturnType } from "../../interfaces/types/GetSrcReturnType";

const propsAffectingURL = ["urlEndpoint", "path", "src", "transformation", "transformationPosition", "queryParameters"];

type GetSrcType = GetSrcReturnType & {
    thumbnailSrc?: string
}

type IKState = IKStateType & {
    thumbnailSrc?: string,
}

type IKProps = IKPropsType & {
    enabledGif?: boolean
    thumbnailTransformation?: any
    onThumbnailLoad?: (thumbnail: string) => void
}

export class IKVideo extends ImageKitComponent {
    videoRef: React.RefObject<HTMLVideoElement> = React.createRef();

    state: IKState = {
        currentUrl: undefined,
        originalSrcLoaded: false,
        intersected: false,
        contextOptions: {}
    };

    constructor(props: IKProps, context: any) {
        super(props, context);
        const { originalSrc, lqipSrc, thumbnailSrc } = this.getSrc();
        this.state = {
            ...this.state,
            originalSrc: originalSrc,
            lqipSrc: lqipSrc,
            thumbnailSrc: thumbnailSrc
        }
    }

    divideUrlAndQueryParams (url: string) {
        let queryIndex = url.indexOf("?");

        let urlStr = url.slice(0, queryIndex);

        let queryParamsStr = url.slice(queryIndex, url.length)

        return { urlStr, queryParamsStr }
    }

    getSrc(): GetSrcType {
        const result: GetSrcType = {
            originalSrc: '',
            lqipSrc: ''
        };
        const { lqip, src, path, transformation, transformationPosition, queryParameters } = this.props;
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
        const urlInfoObj = this.divideUrlAndQueryParams(result.originalSrc);
        if (this.props.enabledGif) {
            result.originalSrc = urlInfoObj.urlStr + '/ik-gif-video.mp4' + urlInfoObj.queryParamsStr;
        }

        if (lqip && lqip.active) {
            const quality = parseInt((lqip.quality || lqip.threshold), 10) || 20;
            const blur = parseInt((lqip.blur || lqip.blur), 10) || 6;
            const newTransformation = options.transformation ? [...options.transformation] : [];
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
            const urlInfoObj = this.divideUrlAndQueryParams(result.lqipSrc);
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
                const urlInfoObj = this.divideUrlAndQueryParams(result.thumbnailSrc);
                result.thumbnailSrc = urlInfoObj.urlStr + '/ik-thumbnail.jpg' + urlInfoObj.queryParamsStr;
            }
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
        } else if (loading === "lazy" && lqip && !lqip.active) {
            this.setState({ currentUrl: this.state.originalSrc })
        } else if (loading !== "lazy" && lqip && !lqip.active) {
            this.setState({ currentUrl: this.state.originalSrc })
        }
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

    areObjectsDifferent(prevProps: IKProps, newProps: IKProps) {
        for (let index = 0; index < propsAffectingURL.length; index++) {
            if (prevProps[propsAffectingURL[index] as keyof IKProps] != newProps[propsAffectingURL[index] as keyof IKProps]) {
                return true;
            };
        }
        return false;
    }

    componentDidUpdate(prevProps: IKProps, prevState: IKState) {
        let contextOptions = this.getContext();

        if (
            this.areObjectsDifferent(prevProps, this.props as IKProps) ||
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
