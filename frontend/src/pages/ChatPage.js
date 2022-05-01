import { Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ChatBoxComponent from "../components/miscellaneous/ChatBoxComponent";
import MyChatsComponent from "../components/miscellaneous/MyChatsComponent";
import SideDrawerComponent from "../components/miscellaneous/SideDrawerComponent";
import { showToast } from "../helpers";
import { fetchChats } from "../http/http-calls";

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [threadLoading, setThreadLoading] = useState(false);

  const _handleSelectChat = (chat = null) => {
    if (chat?._id && !chats.find((each) => each._id === chat._id))
      setChats([chat, ...chats]);

    if (selectedChat?._id !== chat?._id) setSelectedChat(chat);
  };

  const _updateLatestMessage = (latestMessage) => {
    const newChats = [...chats];
    const findChat = newChats.find(
      (each) => each._id === latestMessage.chat._id
    );
    if (findChat) {
      findChat["latestMessage"] = latestMessage;
      setChats(newChats);
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
