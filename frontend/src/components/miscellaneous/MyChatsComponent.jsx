import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Spinner, Stack, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { showToast } from "../../helpers";
import { fetchChats } from "../../http/http-calls";
import GroupChatModal from "../modals/GroupChatModal";
import ChatLoadingComponent from "./ChatLoadingComponent";

const MyChatsComponent = () => {
  const userCredential = useSelector((state) => state?.userCredential);

  const [selectedChat, setSelectedChat] = useState(null);
  const [isOpenGroupChatModal, setIsOpenGroupChatModal] = useState(false);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  const _fetchChats = () => {
    setLoading(true);

    fetchChats()
      .then((res) => {
        setChats(res?.chats?.length ? res.chats : []);
        setLoading(false);
      })
      .catch((error) => {
        console.log("error>>", error);
        setLoading(false);
        showToast(
          error?.reason?.length
            ? error.reason
            : "Server error, Try again after sometime",
          "error"
        );
      });
  };

  const _getSenderName = (chatUsers) => {
    if (chatUsers?.length && userCredential?.user?._id) {
      return chatUsers[0]._id === userCredential.user._id
        ? chatUsers[1].name
        : chatUsers[0].name;
    }
    return "N/A";
  };

  const _toggleGroupChatModal = (isOpen = false) => {
    setIsOpenGroupChatModal(isOpen);
  };

  useEffect(() => {
    _fetchChats();
  }, []);

  return (
    <>
      <Box
        d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p="3"
        bg="white"
        w={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box
          pb="3"
          px="3"
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily="Work sans"
          d="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          My Chats {loading ? <Spinner size="sm" /> : null}
          <Button
            d="flex"
            fontSize={{ base: "16px", md: "10px", lg: "16px" }}
            rightIcon={<AddIcon />}
            onClick={() => _toggleGroupChatModal(true)}
          >
            New Group Chat
          </Button>
        </Box>

        <Box
          d="flex"
          flexDir="column"
          p="3"
          bg="#F8F8F8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
          {chats?.length ? (
            <Stack overflowY="scroll">
              {chats.map((chat) => (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px="3"
                  py="3"
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Text>
                    {chat.isGroupChat
                      ? chat.chatName
                      : _getSenderName(chat.users)}
                  </Text>
                </Box>
              ))}
            </Stack>
          ) : (
            <ChatLoadingComponent />
          )}
        </Box>
      </Box>

      <GroupChatModal
        isOpen={isOpenGroupChatModal}
        toggle={() => _toggleGroupChatModal()}
        fetchChats={() => _fetchChats()}
      />
    </>
  );
};

export default MyChatsComponent;
