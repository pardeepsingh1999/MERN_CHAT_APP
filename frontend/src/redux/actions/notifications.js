import {
  ADD_NOTIFICATION,
  READ_NOTIFICATION,
  CLEAR_NOTIFICATIONS,
} from "./action-types";

export const addNotification = (notification) => {
  return {
    type: ADD_NOTIFICATION,
    payload: {
      notification,
    },
  };
};

export const readNotification = (chatId) => {
  return {
    type: READ_NOTIFICATION,
    payload: {
      chatId,
    },
  };
};

export const clearNotifications = () => {
  return {
    type: CLEAR_NOTIFICATIONS,
  };
};
