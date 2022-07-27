export default {
    MANDATORY_INITIALIZATION_MISSING: { message: "Missing urlEndpoint during SDK initialization", help: "" },
    INVALID_TRANSFORMATION_POSITION: { message: "Invalid transformationPosition parameter", help: "" },
    PRIVATE_KEY_CLIENT_SIDE: { message: "privateKey should not be passed on the client side", help: "" },
    MISSING_UPLOAD_DATA: { message: "Missing data for upload", help: "" },
    MISSING_UPLOAD_FILE_PARAMETER: { message: "Missing file parameter for upload", help: "" },
    MISSING_UPLOAD_FILENAME_PARAMETER: { message: "Missing fileName parameter for upload", help: "" },
    MISSING_AUTHENTICATION_ENDPOINT: { message: "Missing authentication endpoint for upload", help: "" },
    MISSING_PUBLIC_KEY: { message: "Missing public key for upload", help: "" },
    AUTH_ENDPOINT_TIMEOUT: { message: "The authenticationEndpoint you provided timed out in 60 seconds", help: "" },
    AUTH_ENDPOINT_NETWORK_ERROR: { message: "Request to authenticationEndpoint failed due to network error", help: "" },
    AUTH_INVALID_RESPONSE: { message: "Invalid response from authenticationEndpoint. The SDK expects a JSON response with three fields i.e. signature, token and expire.", help: "" },
    UPLOAD_ENDPOINT_NETWORK_ERROR: {
      message: "Request to ImageKit upload endpoint failed due to network error",
      help: "",
    },
    INVALID_UPLOAD_OPTIONS: { message: "Invalid uploadOptions parameter", help: "" },
  };
  