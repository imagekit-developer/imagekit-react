import React from 'react';
import { ImageKitComponent } from "../ImageKit";
import { ImageKitContext } from "../IKContext";
import { IKPropsType } from "../../interfaces/types/IKPropsType";
import { IKStateType } from "../../interfaces/types/IKStateType";
import { GetSrcReturnType } from "../../interfaces/types/GetSrcReturnType";
import { fetchEffectiveConnection, 
    getIKElementsCommonOptions,
    getIKElementsUrl 
} from "../Utils/Utility";

const propsAffectingURL = ["urlEndpoint", "path", "src", "transformation", "transformationPosition", "queryParameters"];

export class IKVideo extends ImageKitComponent {
    videoRef: React.RefObject<HTMLVideoElement> = React.createRef();

    state: IKStateType = {
        currentUrl: undefined,
        originalSrcLoaded: false,
        intersected: false,
        contextOptions: {}
    };

    constructor(props: IKPropsType, context: any) {
        super(props, context);
        const { originalSrc, lqipSrc } = this.getSrc();
        this.state = {
            ...this.state,
            originalSrc: originalSrc,
            lqipSrc: lqipSrc
        }
    }

    getSrc(): GetSrcReturnType {
        const result: GetSrcReturnType = {
            originalSrc: '',
            lqipSrc: ''
        };

        const ikClient = this.getIKClient();
        const contextOptions = this.getContext();
        const options = getIKElementsCommonOptions(this.props, contextOptions);

        result.originalSrc = ikClient.url(options);

        return result;
    }

    getEffectiveConnection() {
        return fetchEffectiveConnection()
    }

    updateVideoUrl() {
        const url = getIKElementsUrl({ loading: '', lqip: null}, this.state);
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

    componentDidUpdate(prevProps: IKPropsType, prevState: IKStateType) {
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
            <source src={currentUrl} type="video/mp4" />
        </video>
    }
}

IKVideo.contextType = ImageKitContext;