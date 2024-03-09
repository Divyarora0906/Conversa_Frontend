import React, { useContext } from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { IsSameSender, isLastMessage, isSameSenderMargin, isSameUser } from './config/ChatLogic';
import { UserContext } from './Context/ChatProvider';
import { Avatar, Tooltip } from '@chakra-ui/react';
import { m } from 'framer-motion';

const ScrollableChat = ({ messages }) => {
  const { users } = useContext(UserContext);
  return (
    <ScrollableFeed>
      {messages.map((message, i) => (
        
        <div style={{ display: 'flex' }} key={message._id}>
          {IsSameSender(messages, message, i, users.data._id) ||
          isLastMessage(messages, i, users.data._id) ? (
            <Tooltip label={message.sender.name} placement="bottom-start" hasArrow>
              <Avatar
                mt="7px"
                mr={1}
                size="sm"
                cursor="pointer"
                name={message.sender.name}
                src={message.sender.img}
              />
            </Tooltip>
          ) : null}
          {


          }
          <span
         style={{
          backgroundColor: `${
            message.sender._id === users.data._id ? "#BEE3F8" : "#ffffff"
          }`,
          marginLeft: isSameSenderMargin(messages, message, i, users.data._id),
          marginTop: isSameUser(messages, message, i, users.data._id) ? 3 : 10,
          borderRadius: "20px",
          padding: "5px 15px",
          maxWidth: "75%",
        }}
          >
            {message.content}
          </span>
        </div>
      ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
