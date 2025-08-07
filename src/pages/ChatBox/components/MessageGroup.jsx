import React from "react";
import Message from "./Message";

const MessageGroup = ({ message, messageIndex, allMessages, chatRef }) => {
  return (
    <div className="chatbox__message-group">
      {/* User Messages */}
      {message.user?.map((userMsg, index) => (
        <Message
          key={`user-${message.id}-${index}`}
          type="user"
          content={userMsg.text}
          timestamp={userMsg.time}
          messageId={message.id}
          index={messageIndex}
          messages={allMessages}
          chatRef={chatRef}
        />
      ))}

      {/* AI Messages */}
      {message.genieAI?.map((aiMsg, index) => (
        <Message
          key={`genie-${message.id}-${index}`}
          type="genie"
          content={aiMsg.message}
          timestamp={aiMsg.time}
          messageId={message.id}
          responseData={aiMsg.responseData}
          index={messageIndex}
          messages={allMessages}
          chatRef={chatRef}
        />
      ))}
    </div>
  );
};

export default MessageGroup;
