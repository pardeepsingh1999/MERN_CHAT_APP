import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  Input,
  Spinner,
  Box,
  Text,
} from "@chakra-ui/react";
import { capitalizeEveryFirstLetter, showToast } from "../../helpers";
import {
  addToGroup,
  createGroupChat,
  getAllUsers,
  removeFromGroup,
  renameGroup,
} from "../../http/http-calls";
import UserListItemComponent from "../miscellaneous/UserListItemComponent";
import UserItemBadge from "../badges/UserItemBadge";
import { useSelector } from "react-redux";

let searchUserTimer;

const GroupChatModal = ({ isOpen, data, toggle, fetchChats }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const userCredential = useSelector((state) => state?.userCredential);

  const _resetModalState = () => {
    setGroupChatName("");
    setSelectedUsers([]);
    setSearch("");
    setSearchResult([]);
    setLoading(false);
  };

  const _setModalState = (data) => {
    setGroupChatName(data.chatName);
  };

  const _onClose = () => {
    _resetModalState();
    toggle();
  };

  const _getAllUsers = (payload) => {
    getAllUsers(payload)
      .then((res) => {
        setSearchResult(res?.users?.length ? res.users : []);
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

  const _handleSearch = (value) => {
    setSearch(value);
    setLoading("search");

    clearTimeout(searchUserTimer);
    if (value?.trim().length) {
      searchUserTimer = setTimeout(() => {
        _getAllUsers({ search: value.trim() });
      }, 1000);
    } else {
      setSearchResult([]);
      setLoading(false);
    }
  };

  const _addToGroup = (user) => {
    try {
      if (loading) return;

      setLoading("addToGroup");

      const payload = {
        chatId: data._id,
        userId: user._id,
      };

      addToGroup(payload)
        .then((res) => {
          showToast("User added", "success");
          fetchChats();
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
    } catch (error) {
      console.log("error>>", error);
      setLoading(false);

      showToast(
        error?.reason?.length
          ? error.reason
          : "Something went wrong, Try again after sometime",
        "error"
      );
    }
  };

  const _handleGroup = (user) => {
    if (loading) return;

    if (!user?._id) {
      showToast("Please select user", "error");
      return;
    }

    if (data) {
      if (data.groupAdmin?._id !== userCredential?.user?._id) {
        showToast("Only admin can add someone", "error");
        return;
      }

      if (
        data.users?.length &&
        data.users.find((each) => each._id === user._id)
      ) {
        showToast("User already in group", "error");
        return;
      }

      _addToGroup(user);
    } else {
      if (selectedUsers.find((each) => each._id === user._id)) {
        showToast("User already added", "error");
        return;
      }
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const _handleDelete = (user) => {
    setSelectedUsers((prev) => prev.filter((each) => each._id !== user._id));
  };

  const _handleSubmit = () => {
    if (!groupChatName?.trim()?.length || !selectedUsers?.length) {
      showToast("Please fill all the fields", "error");
      return;
    }

    setLoading("create");

    const payload = {
      name: groupChatName.trim(),
      users: selectedUsers,
    };

    createGroupChat(payload)
      .then((res) => {
        showToast("New group chat created", "success");
        fetchChats();
        _onClose();
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

  const _handleRename = () => {
    try {
      if (!groupChatName?.trim()?.length || groupChatName === data.chatName)
        return;

      setLoading("rename");

      const payload = {
        chatId: data._id,
        chatName: groupChatName.trim(),
      };

      renameGroup(payload)
        .then((res) => {
          showToast("Group name updated", "success");
          fetchChats();
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
    } catch (error) {
      console.log("error>>", error);
      setLoading(false);

      showToast(
        error?.reason?.length
          ? error.reason
          : "Something went wrong, Try again after sometime",
        "error"
      );
    }
  };

  const _handleRemoveFromGroup = (user) => {
    try {
      if (loading) return;

      if (userCredential?.user?._id === user?._id) setLoading("leaveGroup");
      else setLoading("removeFromGroup");

      const payload = {
        chatId: data._id,
        userId: user._id,
      };

      removeFromGroup(payload)
        .then((res) => {
          fetchChats();
          if (userCredential?.user?._id === user?._id) {
            showToast("You left the group", "success");
            _onClose();
          } else {
            showToast("User removed", "success");
            setLoading(false);
          }
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
    } catch (error) {
      console.log("error>>", error);
      setLoading(false);

      showToast(
        error?.reason?.length
          ? error.reason
          : "Something went wrong, Try again after sometime",
        "error"
      );
    }
  };

  useEffect(() => {
    if (isOpen && data?._id) _setModalState(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, data?._id]);

  return (
    <Modal isOpen={isOpen} onClose={_onClose} size="lg" isCentered>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader
          fontSize="30px"
          fontFamily="Work sans"
          d="flex"
          justifyContent="center"
          alignItems="center"
        >
          {data
            ? (data.chatName && capitalizeEveryFirstLetter(data.chatName)) ||
              "N/A"
            : "Create Group Chat"}{" "}
          {loading === "addToGroup" || loading === "removeFromGroup" ? (
            <Spinner size="sm" ml="3" />
          ) : null}
        </ModalHeader>

        <ModalCloseButton />

        <ModalBody d="flex" flexDir="column" alignItems="center">
          {data?.users?.length ? (
            <Box w="100%" d="flex" flexWrap="wrap" pb="3">
              <Box
                px="2"
                py="1"
                borderRadius="lg"
                m="1"
                mb="2"
                variant="solid"
                fontSize="12"
                bgColor="lightBlue"
              >
                You
              </Box>
              {data.users.map(
                (user) =>
                  user?._id !== userCredential?.user?._id && (
                    <UserItemBadge
                      key={user._id}
                      user={user}
                      handleDelete={() => _handleRemoveFromGroup(user)}
                    />
                  )
              )}
            </Box>
          ) : null}

          <FormControl d="flex">
            <Input
              placeholder="Chat Name"
              mb="3"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            {data ? (
              <Button
                variant="solid"
                colorScheme="teal"
                ml="1"
                isLoading={loading === "rename" ? true : false}
                onClick={() => _handleRename()}
              >
                Update
              </Button>
            ) : null}
          </FormControl>
          <FormControl>
            <Input
              placeholder="Add Users to group"
              mb="1"
              value={search}
              onChange={(e) => _handleSearch(e.target.value)}
            />
          </FormControl>

          {selectedUsers?.length ? (
            <Box w="100%" d="flex" flexWrap="wrap">
              {selectedUsers.map((user) => (
                <UserItemBadge
                  key={user._id}
                  user={user}
                  handleDelete={() => _handleDelete(user)}
                />
              ))}
            </Box>
          ) : null}

          {loading === "search" ||
          loading === "addToGroup" ||
          loading === "removeFromGroup" ? (
            <Spinner m="3" />
          ) : searchResult?.length ? (
            searchResult
              .slice(0, 4)
              .map((user) => (
                <UserListItemComponent
                  key={user._id}
                  user={user}
                  accessChat={() => _handleGroup(user)}
                />
              ))
          ) : search?.trim() ? (
            <Text color="red">User not found</Text>
          ) : null}
        </ModalBody>

        <ModalFooter>
          {data ? (
            <Button
              colorScheme="red"
              onClick={() => _handleRemoveFromGroup(userCredential?.user)}
              isLoading={loading === "leaveGroup" ? true : false}
            >
              Leave Group
            </Button>
          ) : (
            <Button
              colorScheme="blue"
              onClick={() => _handleSubmit()}
              isLoading={loading === "create" ? true : false}
            >
              Create Chat
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GroupChatModal;
