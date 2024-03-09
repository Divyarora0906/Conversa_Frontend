import React, { useEffect } from "react";
import { useState, useContext } from "react";
import { UserContext } from "../Context/ChatProvider";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import Chatloading from "./Chatloading";
import { getImg, getSender } from "../config/ChatLogic";
import GroupChatModal from "./GroupChatModal";
function MyChats({fetchAgain}) {
  const { users, setUsers, selectedChat, setSelectedChat, Chats, setChats } =
    useContext(UserContext);
  const [loggedUser, SetLoggedUser] = useState();

  const toast = useToast();
  const fetchChats = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${users.data?.token}`,
      },
    };
    const {data}  = await axios.get(`https://conversa-backend-659q.onrender.com/api/chat`, config);
    setChats(data);
  };

  useEffect(() => {
    fetchChats();
    SetLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
  }, [fetchAgain]);
  return (
    <>
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        
        bg="white"
        w={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box 
        fontSize={{base:"20px" , md:"34px"}}
        fontFamily="raleway"
        display="flex"
        w="100%"
        p="7px"
        fontWeight="1000"
        justifyContent="space-between"
        alignItems="center"
        bg="#38B2AC"
        color="white"
        >
          Chats
         <GroupChatModal>
         <Button
          display="flex"
          fontSize={{base:"14px" , md:"17px"}}
          rightIcon={<AddIcon />}
          >
            Create Group
          </Button>
         </GroupChatModal>
        </Box>
        <Box
        display="flex"
        flexDirection="column"
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
        >
          {Chats ? (
            <Stack overflowY="scroll">
               {
                Chats.map((Chat)=>(
                  <Box
                  onClick={()=>setSelectedChat(Chat)}
                  cursor="pointer"
                  bg={selectedChat === Chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === Chat ? "white" : "black"}
                  key={Chat._id}
                  height="70px"
                  ml={2}
                  p={3}
                  mr={2}
                  mt={2}
                  borderRadius="20px"
                  >
                    <Text
                    fontSize="18px"
                    >
                      {!Chat.isGroupChat?getSender(loggedUser?.data,Chat.users):Chat.chatName}
                       
                      
                    </Text>
                  </Box>
                ))
               }
            </Stack>
          ):(
            <Chatloading />
          )

          }

        </Box>
      </Box>
    </>
  );
}

export default MyChats;
