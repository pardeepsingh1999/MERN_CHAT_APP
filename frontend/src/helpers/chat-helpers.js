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
