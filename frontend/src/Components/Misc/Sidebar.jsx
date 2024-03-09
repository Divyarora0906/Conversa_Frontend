import {
  Tooltip,
  Box,
  Button,
  Text,
  MenuButton,
  Menu,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";


import axios from "axios"
import { useDisclosure } from "@chakra-ui/hooks";
import React from "react";
import { useState, useContext } from "react";
import { UserContext } from "../Context/ChatProvider";
import ProfileModel from "./ProfileModel";
import { useHistory } from "react-router-dom";
import Chatloading from "./Chatloading";
import UserListItem from "../UserSkel/UserListItem";
import { getSender } from "../config/ChatLogic";
import "./SideBarN.css"
function Sidebar () {
  const [search, setsearch] = useState("");
  const [searchresult, setsearchresult] = useState([]);
  const [loading, setloading] = useState(false);
  const [loadingChat, setloadingChat] = useState();
  const { users, setUsers , selectedChat,setSelectedChat,setChats,Chats,Notification,setNotification} = useContext(UserContext);
  const history = useHistory();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const LogoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  const handlesearch = async() => {
    if (!search) {
      toast({
        title: "Please Search valid user",
        status: "warning",
        duration: "2000",
        isClosable: "true",
        position: "top-left",
      });
      return;
    }
    try {
      setloading(true);
      const config = {
           headers:{
            Authorization: `Bearer ${users.data?.token} `,
           },
        };
        const {data} = await axios.get(`https://conversa-backend-659q.onrender.com/api/user?search=${search}`,config);
        setloading(false);
        setsearchresult(data);
        setsearch("")

    } catch (error) {
      console.log(error)
    }
  };
  const accessChat = async (userId) =>{
    try {
       setloadingChat(true);
       const config = {
        headers:{
        "Content-type":"application/json",
         Authorization: `Bearer ${users.data?.token}`,
        },
     };
      const {data} = await axios.post("https://conversa-backend-659q.onrender.com/api/chat",{userId},config)
      if(!Chats.find((c)=>c._id === data._id))setChats([data,...Chats])
      setSelectedChat(data)
      setloadingChat(false);
      onClose();
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
        borderColor="white"
      >
        <Tooltip label="Search User" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text px="4" display={{ base: "none", md: "flex" }}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Raleway, sans-serif;" fontWeight="900">
          Conversa
          <span style={{fontSize:"13px"}}> Divy-Arora</span>
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
            {Notification.length > 0 && (
                <div className="notification-badge">
                 <span className="badge">    
                  {Notification.length}
                </span>
              </div>
             )}
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
               {!Notification.length && "No New Messages"}
               {
                Notification.map(not=>(
                  <MenuItem key={not._id} onClick={()=>{
                    setSelectedChat(not.chat)
                    setNotification(Notification.filter((n)=>n!==not))
                  }}>
                    {not.chat.isGroupChat?`New Message in ${not.chat.chatName}`:`New Message from ${getSender(users?.data , not.chat.users)}`}
                  </MenuItem>
                ))
               }
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} p="5px">
              <Avatar
                size="sm"
                cursor="pointer"
                src={users.data?.img}
                name={users.data?.name}
              />
            </MenuButton>
            <MenuList>
              <ProfileModel user={users.data}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={LogoutHandler}>LogOut</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search User</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setsearch(e.target.value)}
              />
              <Button onClick={handlesearch}>Go</Button>
            </Box>
            {loading?(
             <Chatloading />
            ):(
             searchresult?.map(user=>(
              <UserListItem 
              key={user._id}
              user={user}
              handlefunction={()=>accessChat(user._id)}
              />
             ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>

        </DrawerContent>
      </Drawer>
    </>
  );
}

export default Sidebar;
