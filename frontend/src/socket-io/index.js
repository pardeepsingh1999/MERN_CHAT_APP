import io from "socket.io-client";
import { SOCKET_BASE_URL } from "../config";

export const newSocket = io(SOCKET_BASE_URL, {
  forceNew: true,
  upgrade: false,
  jsonp: false,
  reconnection: true,
  reconnectionDelay: 100,
  reconnectionAttempts: 100000,
  transports: ["websocket"],
});

var intervalID;

export const connectToSocket = () => {
  return new Promise((resolve, reject) => {
    try {
      var tryReconnect = function () {
        if (newSocket.connected === false) {
          // use a connect() here if you want
          newSocket.connect();
        }
      };

      intervalID = setInterval(tryReconnect, 4000);

      newSocket.on("connect", function () {
        console.log("connected>>", newSocket.connected); // true
        // once client connects, clear the reconnection interval function
        clearInterval(intervalID);
        //... do other stuff
        resolve(newSocket);
      });
    } catch (error) {
      console.log("error>>", error);
      reject(error);
    }
  });
};

export const disconnectToSocket = () => {
  return new Promise((resolve, reject) => {
    try {
      clearInterval(intervalID);

      newSocket.on("disconnect", () => {
        console.log("connected>>", newSocket.connected); // false
      });
      newSocket.close();
      resolve(true);
    } catch (error) {
      console.log("error>>", error);
      reject(error);
    }
  });
};
