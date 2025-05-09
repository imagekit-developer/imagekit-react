import { Image, ImageKitProvider, Video } from "@imagekit/react";

export const Basic = () => {
    return (
        <div>
            <h1>Image</h1>

            <Image
                urlEndpoint="https://ik.imagekit.io/demo/"
                src="default-image.jpg"
                alt="Image without ImageKit provider"
                height={300}
                width={300}
            />

            <ImageKitProvider urlEndpoint="https://ik.imagekit.io/demo/">
                <Image
                    src="/default-image.jpg"
                    alt="Image with ImageKit provider"
                    height={300}
                    width={300}
                />

                {/* Width not number */}
                <Image
                    src="/default-image.jpg"
                    alt="Image with width not number, should produce larger srcset"
                    // @ts-ignore
                    width="300px"
                />

                <Image
                    src="/default-image.jpg"
                    alt="With transformation"
                    transformation={[{ height: 100, width: 100 }]}
                    height={300}
                    width={300}
                />

                <Image
                    src="/default-image.jpg"
                    alt="Image with queryParameters"
                    queryParameters={{
                        version: "v1",
                    }}
                    transformation={[{ height: 100, width: 100 }]}
                    height={300}
                    width={300}
                />

                {/* responsive images with sizes */}
                <Image
                    src="/default-image.jpg"
                    alt="Responsive image with sizes"
                    sizes="(max-width: 600px) 100vw, 50vw"
                    height={300}
                    width={300}
                />

                {/* responsive images with sizes not having vw token */}
                <Image
                    src="/default-image.jpg"
                    alt="Responsive image with sizes - should have very large srcset for all breakpoints"
                    sizes="300px"
                    height={300}
                    width={300}
                />

                {/* urlEndpoint override */}
                <Image
                    urlEndpoint="https://ik.imagekit.io/demo2/"
                    src="/default-image.jpg"
                    alt="Image with urlEndpoint override"
                    transformation={[{ height: 100, width: 100 }]}
                    height={300}
                    width={300}
                />

                {/* Pass className to the image tag as it is */}
                <Image
                    src="/default-image.jpg"
                    alt="Image with className"
                    className="custom-class"
                    height={300}
                    width={300}
                />

                {/* Lazy loading eager */}
                <Image
                    src="/default-image.jpg"
                    alt="Image with lazy loading eager"
                    loading="eager"
                    height={300}
                    width={300}
                />

                {/* Transformation position test */}
                <Image
                    src="/default-image.jpg"
                    alt="Image with path transformation"
                    transformationPosition="path"
                    height={300}
                    width={300}
                />

                {/* Transformation position test with custom transformations */}
                <Image
                    src="/default-image.jpg"
                    alt="Image with path transformation + custom transformations"
                    transformationPosition="path"
                    transformation={[{ height: 100, width: 100 }]}
                    height={300}
                    width={300}
                />

                <Image
                    src="https://ik.imagekit.io/demo/default-image.jpg"
                    alt="path not respected with absolute url"
                    transformationPosition="path"
                    height={300}
                    width={300}
                />

                {/* No width */}
                <Image
                    src="/default-image.jpg"
                    alt="No width"
                />

                {/* Custom deviceBreakpoints */}
                <Image
                    src="https://ik.imagekit.io/demo/default-image.jpg"
                    alt="Custom deviceBreakpoints"
                    deviceBreakpoints={[200, 400, 800]}
                    imageBreakpoints={[100]}
                />

                {/* Responsive off */}
                <Image
                    src="/default-image.jpg"
                    alt="Image with responsive off"
                    height={300}
                    width={300}
                    transformation={[{
                        named: "restrict-unnamed",
                    }]}
                    responsive={false}
                    sizes="(max-width: 600px) 100vw, 50vw"
                />

            </ImageKitProvider>

            <h1>Video</h1>

            <Video
                urlEndpoint="https://ik.imagekit.io/demo/"
                src="sample-video.mp4"
                title="Video without ImageKit provider"
                height={300}
                width={300}
                controls={true}
            />

            {/* With ImageKit provider */}
            <ImageKitProvider urlEndpoint="https://ik.imagekit.io/demo/">
                <Video
                    src="sample-video.mp4"
                    title="Video with ImageKit provider"
                    height={300}
                    width={300}
                    controls={true}
                />

                {/* With transformations */}
                <Video
                    src="sample-video.mp4"
                    title="Video with transformations"
                    transformation={[{ height: 100, width: 100 }]}
                    height={300}
                    width={300}
                    controls={true}
                />

                {/* Passing all props to the video tag as it is */}
                <Video
                    src="sample-video.mp4"
                    title="Video with all props"
                    height={300}
                    width={300}
                    controls
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="none"
                    poster="https://ik.imagekit.io/demo/default-image.jpg"
                />

                {/* urlEndpoint override */}
                <Video
                    urlEndpoint="https://ik.imagekit.io/demo2/"
                    src="sample-video.mp4"
                    title="Video with urlEndpoint override"
                    height={300}
                    width={300}
                    transformation={[{ height: 100, width: 100 }]}
                    controls={true}
                />

                {/* transformationPosition="path" */}
                <Video
                    src="sample-video.mp4"
                    title="Video with path transformation"
                    transformationPosition="path"
                    height={300}
                    width={300}
                    transformation={[{ height: 100, width: 100 }]}
                />

            </ImageKitProvider>
        </div>
    )
}