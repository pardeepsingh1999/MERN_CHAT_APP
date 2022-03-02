import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DEFAULT_PROFILE_PICTURE } from "../../config/index";
import { logout, showToast } from "../../helpers/index";
import ProfileModal from "./ProfileModal";
import { getAllUsers } from "../../http/http-calls";
import ChatLoadingComponent from "./ChatLoadingComponent";
import UserListItemComponent from "./UserListItemComponent";

const SideDrawerComponent = () => {
  const navigate = useNavigate();

  const userCredential = useSelector((state) => state?.userCredential);

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [loadingChat, setLoadingChat] = useState(false);

  const [isOpenProfileModal, setIsOpenProfileModal] = useState(false);

  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const _toggleProfileModal = (isOpen = false) => {
    setIsOpenProfileModal(isOpen);
  };

  const _toggleDrawer = (isOpen = false) => {
    setIsOpenDrawer(isOpen);
  };

  const _handleSearch = () => {
    if (search?.trim().length) {
      setLoading(true);

      getAllUsers({ search: search.trim() })
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
      showToast("Please enter something in search", "error");
    }
  };

  const _accessChat = (userId) => {
    console.log("access chat", userId);
  };

  return (
    <>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={() => _toggleDrawer(true)}>
            <i className="fas fa-search" />
            <Text d={{ base: "none", md: "flex" }} px="4">
              Search user
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>

        <div>
          <Menu>
            <MenuButton p="1">
              <BellIcon fontSize="2xl" m="1" />
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={userCredential?.user?.name}
                src={userCredential?.user?.avatar || DEFAULT_PROFILE_PICTURE}
              />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => _toggleProfileModal(true)}>
                My Profile
              </MenuItem>
              <MenuDivider />
              <MenuItem onClick={() => logout(navigate)}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer
        placement="left"
        onClose={() => _toggleDrawer()}
        isOpen={isOpenDrawer}
      >
        <DrawerOverlay />

        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>

          <DrawerBody>
            <Box d="flex" pb="2">
              <Input
                placeholder="Search by name or email"
                mr="2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={_handleSearch} isLoading={loading}>
                Go
              </Button>
            </Box>

            {loading ? (
              <ChatLoadingComponent />
            ) : (
              searchResult?.map((user) => (
                <UserListItemComponent
                  key={user._id}
                  user={user}
                  accessChat={() => _accessChat(user._id)}
                />
              ))
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <ProfileModal
        isOpen={isOpenProfileModal}
        user={userCredential?.user}
        toggle={() => _toggleProfileModal()}
      />
    </>
  );
};

export default SideDrawerComponent;