import {
  makeGetRequest,
  makePostRequest,
  makePutRequest,
  // makeDeleteRequest,
  uploadFileMultiPart,
} from "./http-service";
import { BASE_URL, IP_FETCH_URL } from "../config/index";

export const login = (payload) => {
  return new Promise((resolve, reject) => {
    makePostRequest(`${BASE_URL}/user/login`, false, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error>>", e);
        reject(e);
      });
  });
};

// export const forgotPassword = (payload) => {
//   return new Promise((resolve, reject) => {
//     makePostRequest(`${BASE_URL}/user/forgotpassword`, false, payload)
//       .then((res) => {
//         resolve(res);
//       })
//       .catch((e) => {
//         console.log("API call error>>", e);
//         reject(e);
//       });
//   });
// };

export const registration = (payload) => {
  return new Promise((resolve, reject) => {
    makePostRequest(`${BASE_URL}/user/register`, false, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error>>", e);
        reject(e);
      });
  });
};

// /**
//  * @param {string} platform - google or facebook
//  * @param {object} payload - {accessToken: google or facefook response token}
//  * @returns
//  */
// export const socialLogin = (platform, payload) => {
//   return new Promise((resolve, reject) => {
//     makePostRequest(`${BASE_URL}/${platform}/signup`, false, payload)
//       .then((res) => {
//         resolve(res);
//       })
//       .catch((e) => {
//         console.log("API call error>>", e);
//         reject(e);
//       });
//   });
// };

export const getIpData = () => {
  return new Promise((resolve, reject) => {
    makeGetRequest(IP_FETCH_URL, false, {}, true)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("getIpData call error: ", e);
        reject(e);
      });
  });
};

// export const checkAvailability = (payload) => {
//   return new Promise((resolve, reject) => {
//     makePostRequest(`${BASE_URL}/user/unique`, true, payload)
//       .then((res) => {
//         resolve(res);
//       })
//       .catch((e) => {
//         console.log("API call error>>", e);
//         reject(e);
//       });
//   });
// };

export const uploadFileOnCloudnary = (payload) => {
  return new Promise((resolve, reject) => {
    uploadFileMultiPart(false, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error>>", e);
        reject(e);
      });
  });
};

export const getLoggedInUserDetail = () => {
  return new Promise((resolve, reject) => {
    makeGetRequest(`${BASE_URL}/user/details`, true)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error>>", e);
        reject(e);
      });
  });
};

export const getAllUsers = (params) => {
  return new Promise((resolve, reject) => {
    makeGetRequest(`${BASE_URL}/user`, true, params)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error>>", e);
        reject(e);
      });
  });
};

export const accessChat = (payload) => {
  return new Promise((resolve, reject) => {
    makePostRequest(`${BASE_URL}/chat`, true, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error>>", e);
        reject(e);
      });
  });
};

export const fetchChats = () => {
  return new Promise((resolve, reject) => {
    makeGetRequest(`${BASE_URL}/chat`, true)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error>>", e);
        reject(e);
      });
  });
};

export const createGroupChat = (payload) => {
  return new Promise((resolve, reject) => {
    makePostRequest(`${BASE_URL}/chat/group`, true, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error>>", e);
        reject(e);
      });
  });
};

export const renameGroup = (payload) => {
  return new Promise((resolve, reject) => {
    makePutRequest(`${BASE_URL}/chat/rename`, true, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error>>", e);
        reject(e);
      });
  });
};

export const addToGroup = (payload) => {
  return new Promise((resolve, reject) => {
    makePutRequest(`${BASE_URL}/chat/groupadd`, true, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error>>", e);
        reject(e);
      });
  });
};

export const removeFromGroup = (payload) => {
  return new Promise((resolve, reject) => {
    makePutRequest(`${BASE_URL}/chat/groupremove`, true, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error>>", e);
        reject(e);
      });
  });
};

export const sendMessage = (payload) => {
  return new Promise((resolve, reject) => {
    makePostRequest(`${BASE_URL}/message`, true, payload)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error>>", e);
        reject(e);
      });
  });
};

export const getAllMessages = (chatId) => {
  return new Promise((resolve, reject) => {
    makeGetRequest(`${BASE_URL}/message/${chatId}`, true)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error>>", e);
        reject(e);
      });
  });
};
