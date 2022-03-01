export const BASE_URL =
  process.env.REACT_APP_BACKEND_ENV === "live"
    ? ""
    : "http://127.0.0.1:5000/api";

export const SOCKET_BASE_URL =
  process.env.REACT_APP_BACKEND_ENV === "live"
    ? ""
    : "http://127.0.0.1:5000/api";

export const IP_FETCH_URL = "https://ipapi.co/json/";

export const cloudName = "dlwhuhzzp";

export const cloudBucketName =
  process.env.REACT_APP_BACKEND_ENV === "live" ? "" : "MERN_CHAT_APP";

export const CLOUDINARY_BASE_URL =
  process.env.REACT_APP_BACKEND_ENV === "live"
    ? ""
    : `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

export const DEFAULT_PROFILE_PICTURE =
  require("../assets/images/default_user_icon.svg").default;

export const AWS_IMAGE_BUCKET_NAME =
  process.env.REACT_APP_BACKEND_ENV === "live" ? "" : "MERN_CHAT_APP";