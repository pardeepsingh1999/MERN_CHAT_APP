import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { showToast } from "../../helpers";
import { createGroupChat, getAllUsers } from "../../http/http-calls";
import UserListItemComponent from "../miscellaneous/UserListItemComponent";
import UserItemBadge from "../badges/UserItemBadge";

const GroupChatModal = ({ isOpen, toggle, fetchChats }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const _resetModalState = () => {
    setGroupChatName("");
    setSelectedUsers([]);
    setSearch("");
    setSearchResult([]);
    setLoading(false);
  };

  const _onClose = () => {
    _resetModalState();
    toggle();
  };

  const _handleSearch = (value) => {
    setSearch(value);

    if (value?.trim().length) {
      setLoading("search");

      getAllUsers({ search: value.trim() })
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
    } else {
      setSearchResult([]);
    }
  };

  const _handleGroup = (user) => {
    if (selectedUsers.includes(user)) {
      showToast("User already added", "error");
      return;
    }

    setSelectedUsers([...selectedUsers, user]);
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

  return (
    <Modal isOpen={isOpen} onClose={_onClose} size="lg" isCentered>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader
          fontSize="30px"
          fontFamily="Work sans"
          d="flex"
          justifyContent="center"
        >
          Create Group Chat
        </ModalHeader>

        <ModalCloseButton />

        <ModalBody d="flex" flexDir="column" alignItems="center">
          <FormControl>
            <Input
              placeholder="Chat Name"
              mb="3"
              onChange={(e) => setGroupChatName(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <Input
              placeholder="Add Users eg: John, Pardeep, Jane"
              mb="1"
              value={search}
              onChange={(e) => _handleSearch(e.target.value)}
            />
          </FormControl>

          {selectedUsers?.length ? (
            <Box w="100%" d="flex" flexWrap="wrap">
              {selectedUsers.map((user, index) => (
                <UserItemBadge
                  key={user._id}
                  user={user}
                  handleDelete={() => _handleDelete(user)}
                />
              ))}
            </Box>
          ) : null}

          {loading === "search" ? (
            <Spinner m="3" />
          ) : (
            searchResult
              ?.slice(0, 4)
              .map((user) => (
                <UserListItemComponent
                  key={user._id}
                  user={user}
                  accessChat={() => _handleGroup(user)}
                />
              ))
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={() => _handleSubmit()}
            isLoading={loading === "create" ? true : false}
          >
            Create Chat
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GroupChatModal;
