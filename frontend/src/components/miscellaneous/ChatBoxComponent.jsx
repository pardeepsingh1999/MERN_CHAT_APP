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
import {
  connectToSocket,
  disconnectToSocket,
  newSocket,
} from "../../socket-io";
import { useSelector } from "react-redux";
import Lottie from "react-lottie";
import typingLoadingAnimationData from "../../assets/animations/typing_loading.json";

const ChatBoxComponent = ({ selectedChat, handleSelectChat, fetchChats }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: typingLoadingAnimationData,
    redererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const [profileModal, setProfileModal] = useState({
    isOpen: false,
    data: null,
  });
  const [groupChatModal, setGroupChatModal] = useState({
    isOpen: false,
  });

  const userCredential = useSelector((store) => store["userCredential"]);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

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

        newSocket.emit("joinChat", selectedChat._id, (res) => {
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

          newSocket.on("typing", (isTyping = false) => {
            console.log("isTyping>>", isTyping);
            setIsTyping(isTyping);
          });
        });

        newSocket.on("messageReceived", (newMessageReceived) => {
          console.log("messageReceived>>", newMessageReceived);

          if (newMessageReceived.error) {
            console.log("error>>", newMessageReceived);
            showToast(
              newMessageReceived?.reason?.length
                ? newMessageReceived.reason
                : "Server error. Try again after sometimes.",
              "error"
            );
            return;
          }

          console.log("selectedChat>>", selectedChat);

          if (newMessageReceived.chat._id === selectedChat._id) {
            setMessages((prev) => [...prev, newMessageReceived]);
          } else {
            // give notification
          }
        });
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

            newSocket.emit("newMessage", res.message, (res) => {
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

    // typing indicator logic
    if (!newSocket.connected) return;

    if (!typing) {
      setTyping(true);
      newSocket.emit("typing", selectedChat._id, true);
    }
  };

  useEffect(() => {
    if (typing) {
      setTimeout(() => {
        newSocket.emit("typing", selectedChat._id, false);
        setTyping(false);
      }, 4000);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typing]);

  const _connectToSocket = () => {
    connectToSocket()
      .then((res) => {
        newSocket.emit("setup", { room: userCredential?.user?._id }, (res) => {
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
  };

  const _disconnectToSocket = () => {
    disconnectToSocket()
      .then((res) => {
        console.log("Disconnected");
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
  };

  useEffect(() => {
    if (selectedChat?._id) {
      newSocket.removeAllListeners("messageReceived");
      newSocket.removeAllListeners("typing");
      _getAllMessages(selectedChat?._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat?._id]);

  useEffect(() => {
    _connectToSocket();

    return () => {
      _disconnectToSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

              <FormControl
                onKeyDown={(e) => _sendMessage(e)}
                isRequired
                mt={isTyping ? "0" : "3"}
              >
                {isTyping ? (
                  <div>
                    <Lottie
                      options={defaultOptions}
                      width={70}
                      // height={50}
                      style={{ margin: 0 }}
                    />
                  </div>
                ) : null}
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
