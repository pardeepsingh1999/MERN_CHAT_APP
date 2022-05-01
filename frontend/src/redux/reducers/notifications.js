import {
  ADD_NOTIFICATION,
  READ_NOTIFICATION,
  CLEAR_NOTIFICATIONS,
} from "../actions";

const initialState = [];

export const notificationsReducer = (state = initialState, action) => {
  let newState = [...state];

  switch (action.type) {
    case ADD_NOTIFICATION: {
      newState = [action.payload.notification, ...newState];
      break;
    }
    case READ_NOTIFICATION: {
      newState = newState.length
        ? newState.filter((each) => each.chat._id !== action.payload.chatId)
        : [];
      break;
    }
    case CLEAR_NOTIFICATIONS: {
      newState = initialState;
      break;
    }
    default:
  }

  return newState;
};
