import { ArrowBackIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { capitalizeEveryFirstLetter, showToast } from "../../helpers";
import { getSenderDetails, getSenderName } from "../../helpers/chat-helpers";
import { getAllMessages, sendMessage } from "../../http/http-calls";
import GroupChatModal from "../modals/GroupChatModal";
import ProfileModal from "../modals/ProfileModal";
import "../../assets/styles/index.css";
import ScrollableChat from "./ScrollableChat";

const ChatBoxComponent = ({ selectedChat, handleSelectChat, fetchChats }) => {
  const [profileModal, setProfileModal] = useState({
    isOpen: false,
    data: null,
  });
  const [groupChatModal, setGroupChatModal] = useState({
    isOpen: false,
  });

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const _toggleProfileModal = (isOpen = false, data = null) => {
    setProfileModal({ isOpen, data });
  };

  const _toggleGroupChatModal = (isOpen = false) => {
    setGroupChatModal({ isOpen });
  };

  const _getAllMessages = (chatId) => {
    setLoading(true);

    getAllMessages(chatId)
      .then((res) => {
        setMessages(res?.messages?.length ? res.messages : []);
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

  const _sendMessage = (event) => {
    if (event.key === "Enter" && newMessage?.trim()) {
      try {
        const payload = {
          content: newMessage.trim(),
          chatId: selectedChat?._id,
        };

        setNewMessage("");

        sendMessage(payload)
          .then((res) => {
            setMessages([...messages, res.message]);
          })
          .catch((error) => {
            console.log("error>>", error);

            showToast(
              error?.reason?.length
                ? error.reason
                : "Server error, Try again after sometime",
              "error"
            );
          });
      } catch (error) {}
    }
  };

  const _typingHandler = (value) => {
    setNewMessage(value);
  };

  useEffect(() => {
    if (selectedChat?._id) _getAllMessages(selectedChat?._id);
  }, [selectedChat?._id]);

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
              {loading ? (
                <Spinner
                  size="xl"
                  w="20"
                  h="20"
                  alignSelf="center"
                  margin="auto"
                />
              ) : (
                <div className="messages">
                  <ScrollableChat messages={messages} />
                </div>
              )}

              <FormControl onKeyDown={(e) => _sendMessage(e)} isRequired mt="3">
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Type message..."
                  onChange={(e) => _typingHandler(e.target.value)}
                  value={newMessage}
                />
              </FormControl>
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
        getAllMessages={() => getAllMessages()}
      />
    </>
  );
};

export default ChatBoxComponent;
