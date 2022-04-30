import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Spinner, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import { capitalizeEveryFirstLetter } from "../../helpers";
import { getSenderName } from "../../helpers/chat-helpers";
import GroupChatModal from "../modals/GroupChatModal";
import ChatLoadingComponent from "./ChatLoadingComponent";

const MyChatsComponent = ({
  selectedChat,
  handleSelectChat,
  threadLoading,
  chats,
  fetchChats,
}) => {
  const [isOpenGroupChatModal, setIsOpenGroupChatModal] = useState(false);

  const _toggleGroupChatModal = (isOpen = false) => {
    setIsOpenGroupChatModal(isOpen);
  };

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
          My Chats {threadLoading ? <Spinner size="sm" /> : null}
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
                  onClick={() => handleSelectChat(chat)}
                  cursor="pointer"
                  bg={
                    selectedChat?._id && selectedChat._id === chat._id
                      ? "#38B2AC"
                      : "#E8E8E8"
                  }
                  color={
                    selectedChat?._id && selectedChat._id === chat._id
                      ? "white"
                      : "black"
                  }
                  px="3"
                  py="3"
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Text>
                    {chat.isGroupChat
                      ? capitalizeEveryFirstLetter(chat.chatName)
                      : getSenderName(chat.users)}
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
        fetchChats={() => fetchChats()}
      />
    </>
  );
};

export default MyChatsComponent;
