import cuid from "cuid";

export class PostManager {
  static remainingMediaFiles = 0;
  static posts = {};

  static addMediaFilesCount = count => {
    const postID = cuid();
    PostManager.posts[postID] = {
      remainingMediaFiles: count
    };

    return postID;
  };

  static onSingleMediaFileUploadCompleted = postID => {
   
    if (!PostManager.posts[postID]) {
      return;
    }
    let { remainingMediaFiles } = PostManager.posts[postID];
    remainingMediaFiles = remainingMediaFiles - 1;
    PostManager.posts[postID]["remainingMediaFiles"] = remainingMediaFiles;
    if (PostManager.posts[postID]["remainingMediaFiles"] === 0) {
      EventEmitter.dispatch("media-file-upload-completed", { postID: postID });
    }
    return;
  };

  static onAllMediaFilesUploadCompleted = (postID, callback) => {
    if (!PostManager.posts[postID]) {
      return;
    }
    EventEmitter.subscribe("media-file-upload-completed", callback);
  };

  static deletePostID = postID => {
    delete PostManager.posts[postID];
  };
}

/**
 * To communicate through events
 */
const EventEmitter = {
  events: {},
  dispatch: function(event, data = null) {
    // Check if the specified event is exist / subscribed by anyone
    if (!this.events[event]) {
      // Doesn't exist, so just return
      return;
    } else {
      // Exists
      // Process all bound callbacks
      this.events[event].forEach(callback => callback(data));
    }
  },
  subscribe: function(event, callback) {
    // Check if the specified event is exist / subscribed by anyone
    if (!this.events[event]) {
      // Not subscribed yet, so make it an array so that further callbacks can be pushed
      this.events[event] = [];
    }
    // Push the current callback
    this.events[event].push(callback);
  }
};
