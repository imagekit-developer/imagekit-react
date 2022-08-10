import React from 'react';
import { ImageKitComponent } from "../ImageKit";
import { ImageKitContext } from "../IKContext";

const propsAffectingURL = ["urlEndpoint", "path", "src", "transformation", "transformationPosition", "queryParameters"];

type GetSrcReturnType = {
    originalSrc: string,
    lqipSrc: string
}

type IKState = {
    currentUrl?: string,
    originalSrc?: string,
    lqipSrc?: string,
    originalSrcLoaded: boolean,
    intersected: boolean,
    contextOptions: any
    observe?: IntersectionObserver
}

type IKProps = {
    lqip?: any,
    src?: string,
    path?: string,
    transformation?: string,
    transformationPosition?: string,
    queryParameters?: { [key: string]: string | number },
    loading?: string,
    alt?: string,
    className?: string
}

export class IKImage extends ImageKitComponent {
    imageRef: React.RefObject<HTMLImageElement> = React.createRef();

    state: IKState = {
        currentUrl: undefined,
        originalSrcLoaded: false,
        intersected: false,
        contextOptions: {}
    };

    constructor(props: IKProps, context: any) {
        super(props, context);
        const { originalSrc, lqipSrc } = this.getSrc();
        this.state = {
            ...this.state,
            originalSrc: originalSrc,
            lqipSrc: lqipSrc,
        }
    }

    getSrc(): GetSrcReturnType {
        const result: GetSrcReturnType = {
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

    updateImageUrl() {
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

    triggerOriginalImageLoad() {
        const img = new Image();
        img.onload = () => {
            this.setState({ originalSrcLoaded: true }, () => {
                this.updateImageUrl();
            });
        }
        img.src = this.state.originalSrc ? this.state.originalSrc : '';
    }

    componentDidMount() {
        this.updateImageUrl();
        this.setState({ contextOptions: this.getContext() });

        const image = this.imageRef.current;
        const { lqip, loading } = this.props;

        if (window && 'IntersectionObserver' in window && loading === "lazy") {
            let connectionType = this.getEffectiveConnection();
            // Values based on native lazy loading in Chrome - https://web.dev/native-lazy-loading/#improved-data-savings-and-distance-from-viewport-thresholds
            let rootMargin = "1250px";
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

            if (image) imageObserver.observe(image);

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
                this.updateImageUrl();
                this.setState({ contextOptions: this.getContext() });
            });
        }
    }

    render() {
        let { currentUrl } = this.state;        
        return <img
            alt={this.props.alt || ""}
            src={currentUrl}
            ref={this.imageRef}
            className={this.props.className}
        />;
    }
}

IKImage.contextType = ImageKitContext;
