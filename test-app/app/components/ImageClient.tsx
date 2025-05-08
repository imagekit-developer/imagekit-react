import { Image } from "@imagekit/react";

export const ImageEvents = () => {
    return (
        <div>
            <Image
                urlEndpoint="https://ik.imagekit.io/demo/"
                src="/default-image.jpg"
                alt="Image with events"
                height={300}
                width={300}
                onError={(e) => {
                    // Set an attribute to this element to indicate that the image failed to load
                    e.currentTarget.setAttribute("data-imagekit-error", "true");
                }}
                onLoad={(e) => {
                    // Set an attribute to this element to indicate that the image loaded successfully
                    e.currentTarget.setAttribute("data-imagekit-loaded", "true");
                }}
                style={{ color: "red" }}
            />


            <Image
                urlEndpoint="https://ik.imagekit.io/demo/"
                src="/does-not-exists-show-call-on-error.jpg"
                alt="Image with events"
                height={300}
                width={300}
                onError={(e) => {
                    // Set an attribute to this element to indicate that the image failed to load
                    e.currentTarget.setAttribute("data-imagekit-error", "true");
                }}
                onLoad={(e) => {
                    // Set an attribute to this element to indicate that the image loaded successfully
                    e.currentTarget.setAttribute("data-imagekit-loaded", "true");
                }}
                style={{ color: "red" }}
            />
        </div>
    )
}
