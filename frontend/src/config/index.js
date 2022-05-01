export const BASE_URL =
  process.env.REACT_APP_BACKEND_ENV === "live" ? "/api" : "/api";

export const SOCKET_BASE_URL =
  process.env.REACT_APP_BACKEND_ENV === "live"
    ? "https://lets-chat.herokuapp.com"
    : "http://127.0.0.1:5000";

export const IP_FETCH_URL = "https://ipapi.co/json/";

export const cloudName = "dlwhuhzzp";

export const cloudBucketName =
  process.env.REACT_APP_BACKEND_ENV === "live"
    ? "MERN_CHAT_APP"
    : "MERN_CHAT_APP";

export const CLOUDINARY_BASE_URL =
  process.env.REACT_APP_BACKEND_ENV === "live"
    ? `https://api.cloudinary.com/v1_1/${cloudName}/upload`
    : `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

export const DEFAULT_PROFILE_PICTURE =
  require("../assets/images/default_user_icon.svg").default;
// "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

export const AWS_IMAGE_BUCKET_NAME =
  process.env.REACT_APP_BACKEND_ENV === "live"
    ? "MERN_CHAT_APP"
    : "MERN_CHAT_APP";

export const APP_NAME = "Let's Chat";
