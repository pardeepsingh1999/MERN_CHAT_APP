import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";
import { capitalize } from "../../helpers";

const UserItemBadge = ({ user, handleDelete }) => {
  return (
    <Box
      px="2"
      py="1"
      borderRadius="lg"
      m="1"
      mb="2"
      variant="solid"
      fontSize="12"
      bgColor="lightBlue"
      cursor="pointer"
      onClick={() => handleDelete()}
    >
      {user?.name ? capitalize(user.name) : "N/A"}
      <CloseIcon pl="1" />
    </Box>
  );
};

export default UserItemBadge;
