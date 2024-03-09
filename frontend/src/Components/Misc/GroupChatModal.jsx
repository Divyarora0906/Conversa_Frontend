import {
  Modal,
  ModalOverlay,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useToast,
  FormControl,
  Input,
  Spinner,
  Box,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../Context/ChatProvider";
import Chatloading from "./Chatloading";
import UserListItem from "../UserSkel/UserListItem";
import UserBadgeItem from "../UserSkel/UserBadgeItem";
function GroupChatModal({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setgroupChatName] = useState();
  const [selectedUser, setselectedUser] = useState([]);
  const [search, setsearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
const [loading,setloading]=useState(false)
  const { users, setUsers, selectedChat, setSelectedChat, Chats, setChats } = useContext(UserContext);  
  const toast = useToast();
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
         const data = await axios.get(`https://conversa-backend-659q.onrender.com/api/user?search=${search}`,config);
   
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
    }
  }
  const handleDelete =(usertodelete)=>{
    setselectedUser(selectedUser.filter(sel => sel._id !== usertodelete._id))


  }
  const handleSumbit = async()=>{

    if(!groupChatName || !selectedUser){
      toast({
        title:"Please fill all fields",
        status:"warning",
        duration:"5000",
        isClosable:true,
        position:"top",
      })
      ;return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${users.data?.token}`,
      },
    };
    const {data} = await axios.post("https://conversa-backend-659q.onrender.com/api/chat/group",{
      name:groupChatName,
      users:JSON.stringify(selectedUser.map((u) => u._id))
    },config)
    setChats([data,...Chats]);
    onClose();
    toast({
      title:"New Group Created",
      duration:"2000",
      isClosable:true,
      status:"success",
      position:"top"
    })

    
  };
  const handleselect = (usertoadd) => {

    if (selectedUser.some(user => user._id === usertoadd._id)) {
      toast({
        title: "User already Added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top"
      });
      return;
    }
    setselectedUser([...selectedUser, usertoadd]);

  };
  
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            justifyContent="center"
            fontFamily="raleway"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Name of Group"
                mb={3}
                onChange={(e) => setgroupChatName(e.target.value)}
              />
              <Input
                placeholder="Add Users e.g Divy, Vivek"
                mb={3}
                onChange={(e) => handlesearch(e.target.value)}
              />
            </FormControl>
            <Box display="flex" flexDir="row">
            {/* render User */}{
              selectedUser.map(u=>(
                <UserBadgeItem key={u._id} user={u} handlefunction={()=> handleDelete(u)}/>
              ))
            }
            </Box>
            {loading?(<div><Spinner /></div>):(
               searchResult.data?.slice(0,4).map(user=>(
                <UserListItem key={user._id} user={user} handlefunction={()=>handleselect(user)}/>
               ))
            )

            }
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue"  onClick={handleSumbit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GroupChatModal;
