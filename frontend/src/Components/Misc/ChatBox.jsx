import React, { useContext } from 'react'
import { UserContext } from '../Context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SingleChat from '../SingleChat';

function ChatBox({fetchAgain,setfetchAgain}) {
  const { users, setUsers, selectedChat, setSelectedChat, Chats, setChats } = useContext(UserContext);  
  return (
    <Box
    display={{base:selectedChat?"flex":"none" , md:"flex"}}
    alignItems="center"
    flexDir="column"
    bg="white"
    w={{base:"100%",md:"70%"}}
    borderRadius="lg"
    borderWidth="1px"
    >
     <SingleChat fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} />
    </Box>
  )
}

export default ChatBox
