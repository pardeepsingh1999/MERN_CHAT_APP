import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";
import { DEFAULT_PROFILE_PICTURE } from "../../config/index";
import { capitalize } from "../../helpers";

const UserListItemComponent = ({ user, accessChat }) => {
  return (
    <Box
      onClick={() => accessChat()}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      d="flex"
      alignItems="center"
      color="black"
      px="3"
      py="2"
      mb="2"
      borderRadius="lg"
    >
      <Avatar
        mr="2"
        size="sm"
        cursor="pointer"
        name={user?.name}
        src={user?.avatar || DEFAULT_PROFILE_PICTURE}
      />

      <Box>
        <Text>{user?.name ? capitalize(user?.name) : "N/A"}</Text>

        <Text fontSize="xs">{user?.email || "N/A"}</Text>
      </Box>
    </Box>
  );
};

export default UserListItemComponent;
