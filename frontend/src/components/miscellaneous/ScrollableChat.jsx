import { Avatar, Tooltip } from "@chakra-ui/react";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { capitalize, generateCalenderDate, isSameDay } from "../../helpers";
import {
  isSameSender,
  isOtherMessage,
  isMyMessage,
} from "../../helpers/chat-helpers";
import { formatTime } from "../../helpers/index";
import Lottie from "react-lottie";
import typingLoadingAnimationData from "../../assets/animations/typing_loading.json";

const ScrollableChat = ({ messages, isTyping }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: typingLoadingAnimationData,
    redererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message, index) => (
          <React.Fragment key={message._id}>
            {message?.createdAt &&
            (!index ||
              (index &&
                messages[index - 1]?.createdAt &&
                !isSameDay(
                  message.createdAt,
                  messages[index - 1].createdAt
                ))) ? (
              <div
                style={{
                  padding: "5px",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                {generateCalenderDate(message.createdAt)}
              </div>
            ) : null}

            <div style={{ display: "flex" }}>
              {((index === messages.length - 1 && isOtherMessage(message)) ||
                isSameSender(messages, message, index)) && (
                <Tooltip
                  label={
                    message.sender?.name
                      ? capitalize(message.sender.name)
                      : "N/A"
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
                      message?.sender?.name
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

              {message?.createdAt ? (
                <span
                  style={{
                    color: "#778899",
                    padding: "5px",
                    fontSize: "12px",
                    alignSelf: "end",
                  }}
                >
                  {formatTime(message.createdAt)}
                </span>
              ) : null}
            </div>
          </React.Fragment>
        ))}

      {isTyping ? (
        <div>
          <Lottie
            options={defaultOptions}
            width={70}
            style={{ marginTop: 10, marginLeft: 0 }}
          />
        </div>
      ) : null}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
