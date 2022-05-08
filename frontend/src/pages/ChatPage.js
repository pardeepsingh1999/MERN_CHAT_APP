import { Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ChatBoxComponent from "../components/miscellaneous/ChatBoxComponent";
import MyChatsComponent from "../components/miscellaneous/MyChatsComponent";
import SideDrawerComponent from "../components/miscellaneous/SideDrawerComponent";
import { showToast } from "../helpers";
import { fetchChats } from "../http/http-calls";
import { newSocket } from "../socket-io";

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [threadLoading, setThreadLoading] = useState(false);

  const _handleSelectChat = (chat = null) => {
    if (chat?._id && !chats.find((each) => each._id === chat._id))
      setChats([chat, ...chats]);

    if (selectedChat?._id !== chat?._id) {
      setSelectedChat((prev) => {
        if (selectedChat?._id) {
          newSocket.emit("unjoinChat", selectedChat._id, (res) => {
            if (res.error) {
              console.log("error>>", res);
              showToast(
                res.reason && res.reason.length
                  ? res.reason
                  : "Server error. Try again after sometimes.",
                "error"
              );
              return;
            }
          });
        }

        return chat;
      });
    }
  };

  const _updateLatestMessage = (latestMessage) => {
    try {
      const newChats = [...chats];
      const findChatIndex = newChats.findIndex(
        (each) => each._id === latestMessage.chat._id
      );
      console.log("findChatIndex", newChats, latestMessage, findChatIndex);
      if (findChatIndex > -1) {
        if (findChatIndex > 0) {
          const spliceChat = newChats.splice(findChatIndex, 1);

          newChats.unshift(spliceChat[0]);
        }

        newChats[0]["latestMessage"] = latestMessage;

        setChats(newChats);
      } else {
        _fetchChats();
      }
    } catch (error) {
      console.log("error>>", error);
      _fetchChats();
    }
  };

  const _fetchChats = () => {
    setThreadLoading(true);

    fetchChats()
      .then((res) => {
        setChats(res?.chats?.length ? res.chats : []);
        setThreadLoading(false);

        if (selectedChat) {
          const findChat = res?.chats?.find(
            (each) => each._id === selectedChat._id
          );
          if (findChat) setSelectedChat(findChat);
          else setSelectedChat(null);
        }
      })
      .catch((error) => {
        console.log("error>>", error);
        setThreadLoading(false);
        showToast(
          error?.reason?.length
            ? error.reason
            : "Server error, Try again after sometime",
          "error"
        );
      });
  };

  useEffect(() => {
    _fetchChats();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <div style={{ width: "100%" }}>
        <SideDrawerComponent
          handleSelectChat={(chat) => _handleSelectChat(chat)}
        />

        <Box
          d="flex"
          justifyContent="space-between"
          w="100%"
          h="91.5vh"
          p="10px"
        >
          <MyChatsComponent
            chats={chats}
            threadLoading={threadLoading}
            selectedChat={selectedChat}
            handleSelectChat={(chat) => _handleSelectChat(chat)}
            fetchChats={() => _fetchChats()}
          />
          <ChatBoxComponent
            selectedChat={selectedChat}
            handleSelectChat={(chat) => _handleSelectChat(chat)}
            fetchChats={() => _fetchChats()}
            updateLatestMessage={(latestMessage) =>
              _updateLatestMessage(latestMessage)
            }
          />
        </Box>
      </div>
    </div>
  );
};

export default ChatPage;
