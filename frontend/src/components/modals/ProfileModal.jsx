import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
  Text,
} from "@chakra-ui/react";
import { capitalize } from "../../helpers";
import { DEFAULT_PROFILE_PICTURE } from "../../config/index";

const ProfileModal = ({ isOpen, toggle, user }) => {
  const _onClose = () => {
    toggle();
  };

  return (
    <Modal isOpen={isOpen} onClose={_onClose} size="lg" isCentered>
      <ModalOverlay />

      <ModalContent h="410px">
        <ModalHeader
          fontSize="40px"
          fontFamily="Work sans"
          d="flex"
          justifyContent="center"
        >
          {user?.name ? capitalize(user.name) : "N/A"}
        </ModalHeader>

        <ModalCloseButton />

        <ModalBody
          d="flex"
          flexDir="column"
          alignItems="center"
          justifyContent="space-between"
        >
          <Image
            borderRadius="full"
            boxSize="150px"
            src={user?.avatar ? user?.avatar : DEFAULT_PROFILE_PICTURE}
            alt={user?.name}
          />

          <Text fontSize={{ base: "20px", md: "30px" }} fontFamily="Work sans">
            {user?.email || "N/A"}
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={_onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProfileModal;
