import toast from "react-hot-toast";

export const showToast = (message, type = "error", duration = 4000) => {
  toast[type](message, { duration });
};
