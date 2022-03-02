import { Box } from "@chakra-ui/react";
import React from "react";
import ChatBoxComponent from "../components/miscellaneous/ChatBoxComponent";
import MyChatsComponent from "../components/miscellaneous/MyChatsComponent";
import SideDrawerComponent from "../components/miscellaneous/SideDrawerComponent";

const ChatPage = () => {
  return (
    <div className="App">
      <div style={{ width: "100%" }}>
        <SideDrawerComponent />

        <Box
          d="flex"
          justifyContent="space-between"
          w="100%"
          h="91.5vh"
          p="10px"
        >
          <MyChatsComponent />
          <ChatBoxComponent />
        </Box>
      </div>
    </div>
  );
};

export default ChatPage;
