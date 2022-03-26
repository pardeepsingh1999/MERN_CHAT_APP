import { Avatar, Tooltip } from "@chakra-ui/react";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { capitalize } from "../../helpers";
import {
  isSameSender,
  isOtherMessage,
  isMyMessage,
} from "../../helpers/chat-helpers";

const ScrollableChat = ({ messages }) => {
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message, index) => (
          <div style={{ display: "flex" }} key={message._id}>
            {((index === messages.length - 1 && isOtherMessage(message)) ||
              isSameSender(messages, message, index)) && (
              <Tooltip
                label={
                  message.sender?.name ? capitalize(message.sender.name) : "N/A"
                }
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr="1"
                  size="sm"
                  cursor="pointer"
                  name={
                    message.sender?.name
                      ? capitalize(message.sender.name)
                      : "N/A"
                  }
                  src={message.sender.avatar}
                />
              </Tooltip>
            )}

            {isMyMessage(message) ? (
              // my message
              <span
                style={{
                  backgroundColor: "#BEE3F8",
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  marginLeft: "auto",
                  marginTop: 3,
                }}
              >
                {message.content}
              </span>
            ) : (
              // other message
              <span
                style={{
                  backgroundColor: "#B9F5D0",
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  marginLeft:
                    isSameSender(messages, message, index) ||
                    index === messages.length - 1
                      ? 0
                      : 33,
                  marginTop: 10,
                }}
              >
                {message.content}
              </span>
            )}
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
