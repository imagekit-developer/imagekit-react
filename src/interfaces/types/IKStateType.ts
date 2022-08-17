export interface IKStateType {
    currentUrl?: string,
    originalSrc?: string,
    lqipSrc?: string,
    originalSrcLoaded: boolean,
    intersected: boolean,
    contextOptions: any
    observe?: IntersectionObserver
}