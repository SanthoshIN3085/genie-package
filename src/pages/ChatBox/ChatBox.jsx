import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import GeniePromptBox from "Components/GeniePromptBox/GeniePromptBox";
import { MessageGroup } from "./components";

const ChatBox = ({ handleSideNavClick, handleFormSubmit, chatRef }) => {
  const { selectedMessages } = useSelector((state) => state.genie.chat);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (chatRef?.current && selectedMessages.length > 0) {
      setTimeout(() => {
        chatRef.current.scrollTo({
          top: chatRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [selectedMessages.length, chatRef]);

  return (
    <div className="chatbox">
      <div className="chatbox__messages" ref={chatRef}>
        {selectedMessages.map((message, messageIndex) => (
          <MessageGroup
            key={message.id}
            message={message}
            messageIndex={messageIndex}
            allMessages={selectedMessages}
            chatRef={chatRef}
          />
        ))}
      </div>

      <div className="genie-prompt-wrapper">
        <GeniePromptBox
          handleSideNavClick={handleSideNavClick}
          handleFormSubmit={handleFormSubmit}
        />
      </div>
    </div>
  );
};

export default ChatBox;
