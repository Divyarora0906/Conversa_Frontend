import React, { useContext } from 'react'
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useToast } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { UserContext } from '../Context/ChatProvider';
import { useState } from 'react';
import UserBadgeItem from '../UserSkel/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserSkel/UserListItem';
function UpdateGroupChatModal({ fetchAgain, setfetchAgain,fetchMessages }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setsearch] = useState("");
    const [SearchResult, setSearchResult] = useState([]);
    const [renameloading, setRenameloading] = useState(false);
    const [loading, setloading] = useState(false);
    const toast = useToast();
    const { users, setUsers, selectedChat, setSelectedChat, Chats, setChats } =
    useContext(UserContext);
  
    const AddUsertoGroup = async(user1)=>{
         if(selectedChat.users.find((u)=>u._id===user1._id)){
          toast({
            title:"Already in the Group ",
            description:"Failed to Add the User",
            status:"warning",
            duration:2000,
            isClosable:true,
            position:"bottom-left"
        })
        return
         }
        if(selectedChat.groupAdmin?._id !== users.data?._id){
          toast({
            title:"Only Admin can Add in the Group ",
            description:"Failed to Add the User",
            status:"warning",
            duration:2000,
            isClosable:true,
            position:"bottom-left"
          });
          return
        }
        try {
          setloading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${users.data?.token}`,
            },
          }
         const {data} = await axios.put("https://conversa-backend-659q.onrender.com/api/chat/groupadd",{
           chatId:selectedChat._id,
           userId:user1._id
         },config)
              

         setSelectedChat(data);
         setfetchAgain(!fetchAgain);
         setloading(false)
        } catch (error) {
          toast({
            title:"Error Removing the Group ",
            description:"Failed to Remove the User",
            status:"error",
            duration:2000,
            isClosable:true,
            position:"bottom-left"
        })
        }
        }
  
   const handleremove = async(user1)=>{

    if(selectedChat.groupAdmin?._id !== users.data?._id && user1?._id !== users.data?._id){
      toast({
        title: "Only Admins can Remove",
        description: "An error occurred while renaming the chat.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return
    }
    try {  
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${users.data?.token}`,
        },
      }

     const {data} = await axios.put("https://conversa-backend-659q.onrender.com/api/chat/groupremove",{
       chatId:selectedChat._id,
       userId:user1._id
     },config);
      user1._id === users.data._id ? setSelectedChat():setSelectedChat(data);
      setfetchAgain(!fetchAgain);
      fetchMessages();
      setloading(false);
 
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: "An error occurred while Removing the chat.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
     setloading(false)

    }
   }
    const handlerename = async () => {
        if (!groupChatName) return;
        try {
          setRenameloading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${users.data?.token}`,
            },
          };
          const { data } = await axios.put(
            `https://conversa-backend-659q.onrender.com/api/chat/rename`,
            {
              chatId: selectedChat._id,
              chatName: groupChatName,
            },
            config
          );
        
          setSelectedChat(data);
          setfetchAgain(!fetchAgain);
          setRenameloading(false);
      
        } catch (error) {
          console.error("Error occurred during rename:", error); // Log the error
          toast({
            title: "Error Occurred",
            description: "An error occurred while renaming the chat.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setRenameloading(false);
        }
        setGroupChatName("");
      };
      
      const handlesearch = async(q) =>{
        setsearch(q);
        if(!q){
            return;
        }
        try {
            setloading(true)

            const config = {
                headers:{
                 Authorization: `Bearer ${users.data?.token} `,
                },
             };
             const {data} = await axios.get(`https://conversa-backend-659q.onrender.com/api/user?search=${search}`,config);
            setloading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title:"Error Occured",
                description:"Failed to load the Search Results",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom-left"
            })
            setloading(false)
        }
      }

 
  
    return (
        <>
            <IconButton icon={<ViewIcon />} onClick={onOpen}>Open Modal</IconButton>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                            {selectedChat.users.map(u => (
                                <UserBadgeItem  user={u} handlefunction={() => handleremove(u)} />
                              

                            ))}
                        </Box>
                        <FormControl display="flex">
                            <Input placeholder='Chat name' mb={3} value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} />
                            <Button variant="solid" colorScheme='teal' ml={1} isLoading={renameloading} onClick={handlerename}>Update</Button>
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add User to the Group' mb={1} onChange={(e)=>handlesearch(e.target.value)}/>
                        </FormControl>
                        {loading?(
                          <Spinner size="lg" />
                        ):(
                          SearchResult?.map((user)=>(
                            <UserListItem 
                            key={user._id}
                            user={user}
                            handlefunction={()=>AddUsertoGroup(user)}
                            />
                          ))
                        )
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={()=>handleremove(users.data)}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal
