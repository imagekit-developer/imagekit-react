/**
 * Type of files to include in result set. Accepts three values:
 * all - include all types of files in result set
 * image - only search in image type files
 * non-image - only search in files which are not image, e.g., JS or CSS or video files.
 *
 * @link https://docs.imagekit.io/api-reference/media-api/list-and-search-files
 */
 export type FileType = "all" | "image" | "non-image";

 /**
  * Metadata object structure
  * @link https://docs.imagekit.io/api-reference/metadata-api#metadata-object-structure
  * 
  * Contents of Object
  * 
  * - Exif
  * 
  * For more information about the Exif standard, please refer to the specification found on http://www.exif.org. A comprehensive list of available Exif attributes and their meaning can be found on http://www.sno.phy.queensu.ca/~phil/exiftool/TagNames/.
  * 
  * - Perceptual Hash (pHash)
  * 
  * Perceptual hashing allows you to construct a hash value that uniquely identifies an input image based on the image's contents. It is different from cryptographic hash functions like MD5 and SHA1. pHash provides similar hash value after minor distortions, like small rotations, blurring, and compression in the image.
  */
 export interface Metadata {
   height: number;
   width: number;
   size: number;
   format: string;
   hasColorProfile: boolean;
   quality: number;
   density: number;
   hasTransparency: boolean;
   pHash: string;
   exif: {
     image: {
       Make: string;
       Model: string;
       Orientation: number;
       XResolution: number;
       YResolution: number;
       ResolutionUnit: number;
       Software: string;
       ModifyDate: string;
       YCbCrPositioning: number;
       ExifOffset: number;
       GPSInfo: number;
     };
     thumbnail: {
       Compression: number;
       XResolution: number;
       YResolution: number;
       ResolutionUnit: number;
       ThumbnailOffset: number;
       ThumbnailLength: number;
     };
     exif: {
       ExposureTime: number;
       FNumber: number;
       ExposureProgram: number;
       ISO: number;
       ExifVersion: string;
       DateTimeOriginal: string;
       CreateDate: string;
       ShutterSpeedValue: number;
       ApertureValue: number;
       ExposureCompensation: number;
       MeteringMode: number;
       Flash: number;
       FocalLength: number;
       SubSecTime: string;
       SubSecTimeOriginal: string;
       SubSecTimeDigitized: string;
       FlashpixVersion: string;
       ColorSpace: number;
       ExifImageWidth: number;
       ExifImageHeight: number;
       InteropOffset: number;
       FocalPlaneXResolution: number;
       FocalPlaneYResolution: number;
       FocalPlaneResolutionUnit: number;
       CustomRendered: number;
       ExposureMode: number;
       WhiteBalance: number;
       SceneCaptureType: number;
     };
     gps: { GPSVersionID: number[] };
     interoperability: {
       InteropIndex: string;
       InteropVersion: string;
     };
     makernote: any;
   };
 }
 
 /**
  * Response from uploading a file
  *
  * @link https://docs.imagekit.io/api-reference/upload-file-api/server-side-file-upload#response-code-and-structure-json
  */
 export interface UploadResponse {
   /**
    * Unique fileId. Store this fileld in your database, as this will be used to perform update action on this file.
    */
   fileId: string;
   /**
    * The name of the uploaded file.
    */
   name: string;
   /**
    * The URL of the file.
    */
   url: string;
   /**
    * In case of an image, a small thumbnail URL.
    */
   thumbnailUrl: string;
   /**
    * Height of the uploaded image file. Only applicable when file type is image.
    */
   height: number;
   /**
    * Width of the uploaded image file. Only applicable when file type is image.
    */
   width: number;
   /**
    * Size of the uploaded file in bytes.
    */
   size: number;
   /**
    * Type of file. It can either be image or non-image.
    */
   fileType: FileType;
   /**
    * The path of the file uploaded. It includes any folder that you specified while uploading.
    */
   filePath: string;
   /**
    * Array of tags associated with the image.
    */
   tags?: string[];
   /**
    * Is the file marked as private. It can be either true or false.
    */
   isPrivateFile: boolean;
   /**
    * Value of custom coordinates associated with the image in format x,y,width,height.
    */
   customCoordinates: string | null;
   /**
    * The metadata of the upload file. Use responseFields property in request to get the metadata returned in response of upload API.
    */
   metadata?: Metadata;
   /*
    * AITags field is populated only because the google-auto-tagging extension was executed synchronously and it received a successresponse.
    */
   AITags?: object[];
   /*
    * Field object which will contain the status of each extension at the time of completion of the update/upload request.
    */ 
   extensionStatus?: { [key: string]: string }
 }
 