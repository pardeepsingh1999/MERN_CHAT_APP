import { capitalizeEveryFirstLetter } from ".";
import { store as REDUX_STORE } from "../redux/store";

export const getSenderName = (chatUsers) => {
  const state = REDUX_STORE.getState();

  if (chatUsers?.length && state?.userCredential?.user?._id) {
    return chatUsers[0]._id === state?.userCredential.user._id
      ? capitalizeEveryFirstLetter(chatUsers[1].name)
      : capitalizeEveryFirstLetter(chatUsers[0].name);
  }
  return "N/A";
};

export const getSenderDetails = (chatUsers) => {
  const state = REDUX_STORE.getState();

  if (chatUsers?.length && state?.userCredential?.user?._id) {
    return chatUsers[0]._id === state?.userCredential.user._id
      ? chatUsers[1]
      : chatUsers[0];
  }
  return "N/A";
};

export const isMyMessage = (message) => {
  const state = REDUX_STORE.getState();

  if (
    message?.sender?._id &&
    state?.userCredential?.user?._id &&
    message?.sender?._id === state?.userCredential?.user?._id
  )
    return true;

  return false;
};

export const isOtherMessage = (message) => {
  const state = REDUX_STORE.getState();

  if (
    message?.sender?._id &&
    state?.userCredential?.user?._id &&
    message?.sender?._id !== state?.userCredential?.user?._id
  )
    return true;

  return false;
};

export const isSameSender = (messages, message, index) => {
  const state = REDUX_STORE.getState();

  if (
    message?.sender?._id &&
    state?.userCredential?.user?._id &&
    message?.sender?._id !== state?.userCredential?.user?._id &&
    messages[index + 1] &&
    messages[index + 1].sender?._id === state?.userCredential?.user?._id
  )
    return true;

  return false;
};
