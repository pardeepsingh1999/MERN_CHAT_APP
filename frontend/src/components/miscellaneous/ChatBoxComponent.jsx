import { ArrowBackIcon, ViewIcon } from "@chakra-ui/icons";
import { Box, IconButton, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { capitalizeEveryFirstLetter } from "../../helpers";
import { getSenderDetails, getSenderName } from "../../helpers/chat-helpers";
import GroupChatModal from "../modals/GroupChatModal";
import ProfileModal from "../modals/ProfileModal";

const ChatBoxComponent = ({ selectedChat, handleSelectChat, fetchChats }) => {
  const [profileModal, setProfileModal] = useState({
    isOpen: false,
    data: null,
  });
  const [groupChatModal, setGroupChatModal] = useState({
    isOpen: false,
  });

  const _toggleProfileModal = (isOpen = false, data = null) => {
    setProfileModal({ isOpen, data });
  };

  const _toggleGroupChatModal = (isOpen = false) => {
    setGroupChatModal({ isOpen });
  };

  return (
    <>
      <Box
        d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
        alignItems="center"
        flexDir="column"
        p="3"
        bg="white"
        w={{ base: "100%", md: "68%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        {selectedChat ? (
          <>
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              pb="3"
              px="2"
              w="100%"
              fontFamily="Work sans"
              d="flex"
              justifyContent={{ base: "space-between" }}
              alignItems="center"
            >
              <IconButton
                d={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => handleSelectChat()}
              />
              {selectedChat?.isGroupChat ? (
                <>
                  {capitalizeEveryFirstLetter(selectedChat.chatName)}
                  <IconButton
                    icon={<ViewIcon />}
                    onClick={() => _toggleGroupChatModal(true)}
                  />
                </>
              ) : (
                <>
                  {getSenderName(selectedChat.users)}
                  <IconButton
                    icon={<ViewIcon />}
                    onClick={() =>
                      _toggleProfileModal(
                        true,
                        getSenderDetails(selectedChat.users)
                      )
                    }
                  />
                </>
              )}
            </Text>

            <Box
              d="flex"
              flexDir="column"
              justifyContent="flex-end"
              p="3"
              bg="#E8E8E8"
              w="100%"
              h="100%"
              borderRadius="lg"
              overflowY="hidden"
            >
              {/* messages here */}
            </Box>
          </>
        ) : (
          <Box d="flex" alignItems="center" justifyContent="center" h="100%">
            <Text fontSize="3xl" pb="3" fontFamily="Work sans">
              Click on a user to start chatting
            </Text>
          </Box>
        )}
      </Box>

      <ProfileModal
        isOpen={profileModal.isOpen}
        user={profileModal.data}
        toggle={() => _toggleProfileModal()}
      />

      <GroupChatModal
        isOpen={groupChatModal.isOpen}
        data={selectedChat?.isGroupChat ? selectedChat : null}
        toggle={() => _toggleGroupChatModal()}
        fetchChats={() => fetchChats()}
      />
    </>
  );
};

export default ChatBoxComponent;
