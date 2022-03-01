import cuid from "cuid";
import { uploadPhotoToCloudinary } from "../../helpers";

export class UploadQueueManager {
  static uploadQueue = [];

  static addMediaToQueue = (media, mediaType) => {
    const uploadId = cuid();
    // Add to queue
    const mediaToUpload = {
      data: { media, mediaType },
      uploadId,
    };
    UploadQueueManager.uploadQueue.push(mediaToUpload);
    // Start upload process
    UploadQueueManager.startUploadProcess(mediaToUpload);
    // Return back uploadId
    EventEmitter.dispatch(
      "upload-queue-count-change",
      UploadQueueManager.uploadQueue.length
    );
    return uploadId;
  };

  static startUploadProcess = async (media) => {
    let uploadLink;
    try {
      uploadLink = await UploadQueueManager.uploadMedia(
        media.data.media,
        media.data.mediaType
      );
    } catch (error) {
      console.log("error>>", error);
    }
    EventEmitter.dispatch(`upload-complete-for-${media.uploadId}`, {
      ...media,
      fileUrl: uploadLink,
    });
    // Remove media from queue
    UploadQueueManager.removeFromQueue(media.uploadId);
    // Emit queue count change event
    EventEmitter.dispatch(
      "upload-queue-count-change",
      UploadQueueManager.uploadQueue.length
    );
  };

  static onCompleteUploadProcess = (callback) => {
    EventEmitter.subscribe("complete-upload-process", callback);
    // EventEmitter.unsubscribe("complete-upload-process");
  };

  static onUploadComplete = (uploadId, callback) => {
    // Emit complete event
    EventEmitter.subscribe(`upload-complete-for-${uploadId}`, callback);
  };

  static onQueueCountChange = (callback) => {
    EventEmitter.subscribe("upload-queue-count-change", callback);
  };

  static removeFromQueue = (uploadId) => {
    const indexOfMedia = UploadQueueManager.uploadQueue.findIndex(
      (media) => media.uploadId === uploadId
    );
    UploadQueueManager.uploadQueue.splice(indexOfMedia, 1);
    if (
      !UploadQueueManager.uploadQueue ||
      !UploadQueueManager.uploadQueue.length
    ) {
      EventEmitter.dispatch("complete-upload-process");
      // setTimeout(() => {
      //   EventEmitter.events = {};
      // }, 500);
    }
  };

  static uploadMedia = (media, mediaType) => {
    return new Promise(async (resolve, reject) => {
      try {
        switch (mediaType) {
          case "pdf":
          case "image": {
            const imageUrl = await uploadPhotoToCloudinary(media.file, "blob");
            resolve(imageUrl);
            break;
          }
          case "video": {
            const videoUrl = await uploadPhotoToCloudinary(
              media.blobObject,
              "blob",
              null,
              "video"
            );
            resolve(videoUrl);
            break;
          }
          case "audio": {
            const audioUrl = await uploadPhotoToCloudinary(
              media.blobObject.blob,
              "blob",
              null,
              "audio"
            );
            resolve(audioUrl);
            break;
          }
          default:
        }
      } catch (error) {
        reject(error);
      }
    });
  };
}

/**
 * To communicate through events
 */
const EventEmitter = {
  events: {},
  dispatch: function (event, data = null) {
    // Check if the specified event is exist / subscribed by anyone
    if (!this.events[event]) {
      // Doesn't exist, so just return
      return;
    } else {
      // Exists
      // Process all bound callbacks
      this.events[event].forEach((callback) => callback(data));
    }
  },
  subscribe: function (event, callback) {
    // Check if the specified event is exist / subscribed by anyone
    if (!this.events[event]) {
      // Not subscribed yet, so make it an array so that further callbacks can be pushed
      this.events[event] = [];
    }
    // Push the current callback
    this.events[event].push(callback);
  },
};
