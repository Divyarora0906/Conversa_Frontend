import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./Context/ChatProvider";
import { Box, Button, Flex, FormControl, IconButton, Input, Spinner, Text, Toast, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderfull } from "./config/ChatLogic"
import ProfileModel from "./Misc/ProfileModel"
import UpdateGroupChatModal from "./Misc/UpdateGroupChatModal";
import axios from "axios";
import animationData from "../animation/typing.json"
import "./Style.css"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie"
import {io} from"socket.io-client"
const ENDPOINT = "https://conversa-backend-659q.onrender.com";

var socket,selectedChatCompare;

function SingleChat({ fetchAgain, setfetchAgain }) {
   const [messages,setmessages] = useState([]);
   const [loading,setloading]=useState(false);
   const[newMessage,setnewMessage]= useState("");
   const[socketconn,setsocketconn]= useState(false);
   const [typing,setTyping] = useState(false);
   const [istyping,setisTyping] = useState(false);
   const [showPicker, setShowPicker] = useState(false);
   const[emoji , setemoji] = useState("");
   
   const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  let picker = ()=>{
    setShowPicker((prevShowPicker) => !prevShowPicker)
  }
  let emojihandle = (emoji)=>{
   let emojiss  = emoji.native;
   setnewMessage((prev)=>prev + emojiss)
  }
    
   
   const toast = useToast()
  const { users, setUsers, selectedChat, setSelectedChat, Chats, setChats,Notification,setNotification } =
    useContext(UserContext);
   
    useEffect(()=>{
      socket = io(ENDPOINT);
      socket.emit("setup",users);
      socket.on("connected",()=> setsocketconn(true))
      socket.on("typing",()=>setisTyping(true));
      socket.on("stoptyping",()=>setisTyping(false));
     },[])
    const fetchMessages =async()=>{
      if(!selectedChat){
        return
      }
      try {
        const config = {
          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${users.data?.token}`
          }}
          setloading(true);
          const {data} = await axios.get(`https://conversa-backend-659q.onrender.com/api/message/${selectedChat._id}`,config);
   
          setmessages(data);
          socket.emit('joinchat',selectedChat._id);
          setloading(false);
          

      } catch (error) {
         toast({
            title: "Error Sending",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top"
          })
      }
    }
    useEffect(()=>{
     fetchMessages(); 
     selectedChatCompare = selectedChat;
    },[selectedChat]);
    useEffect(()=>{
      socket.on('messagerecieved',(newMessgRecieved)=>{
        if(!selectedChatCompare || 
          selectedChatCompare._id !== newMessgRecieved.chat._id){
          if(!Notification.includes(newMessgRecieved))
          {
            setNotification([newMessgRecieved,...Notification]);
            setfetchAgain(!fetchAgain);
          }
        }
        else{
          setmessages([...messages,newMessgRecieved])
        }
      })
    })

    const sendMessage=async(ev)=>{
       if(ev.key==="Enter" || newMessage){
    socket.emit("stoptyping",selectedChat._id)
        try {
          const config = {
            headers:{
              "Content-Type":"application/json",
              Authorization:`Bearer ${users.data?.token}`
            }
         
          }
          const {data} = await axios.post("https://conversa-backend-659q.onrender.com/api/message",{
            content:newMessage,
            chatId:selectedChat._id,
          },config);
          
          setnewMessage("");
          if(showPicker)setShowPicker(!showPicker)
          socket.emit('newMessg',data)
         
          setmessages([...messages,data]);
          console.log(data)
        } catch (error) {
          toast({
            title: "Error Sending",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top"
          })
        }
       }
    }
    const typingHandler =(e)=>{
       setnewMessage(e.target.value);
       
       if(!socketconn) return;

       if(!typing){
        setTyping(true);
        socket.emit("typing",selectedChat._id);
       }
       let lasttypingTime = new Date().getTime();
       var timerlength = 3000;
       setTimeout(() => {
        var timeNow = new Date().getTime();
        var timeDiff = timeNow - lasttypingTime;
        if(timeDiff>=timerlength && typing){
          socket.emit("stoptyping",selectedChat._id)
          setTyping(false);
        }
       }, timerlength);
     
     
    }

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            paddingTop="20px"
            w="100%"
            fontFamily="raleway"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            ></IconButton>
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(users?.data, selectedChat?.users)}
                <ProfileModel user={getSenderfull(users, selectedChat)} />
              </>
            ) : (
              <>

                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal 
                fetchAgain={fetchAgain}
                setfetchAgain={setfetchAgain}
                fetchMessages={fetchMessages}
                />

              </>
            )}
          </Text>
          <Box display="flex" flexDir="column"
                  justifyContent="flex-end"  bg="#E8E8E8" w="100%" h="100%" borderRadius="lg" overflowY="hidden">
                  
              {
                loading?(
                  <Spinner 
                  />
                ):(
                  <div className="Messages">
                      <ScrollableChat messages={messages}/>
                  </div>
                )
              }
              <FormControl  isRequired mt={3}>
                {istyping?  <div>
                  <Lottie
                    options={defaultOptions}
                    height={40}
                    
                    width={70}
                    style={{borderRadius:"50px", marginBottom: 15, marginLeft: "10px" }}
                  />
                </div>:(<></>)}
                {showPicker && (
                  <div style={{height:"40px", position:"absolute", bottom:"460px"}}>
                  <Picker className="emoji" data={data} onEmojiSelect={emojihandle} />
                  </div>
                )}
              <span onClick={picker} style={{fontSize:"23px" , margin:"0px 0px 0px 5px",position:"absolute",bottom:"12px",zIndex:"5",cursor:"pointer"}} >
             {showPicker ? "🤣" :"😀"}
                </span>
                <Flex alignItems="center" flexDirection="row">
                <Input  variant="filled" paddingLeft="40px" bg="#E0E0E0" placeholder="Enter a Message" height="60px" onChange={typingHandler} value={newMessage}/>
                <Button
    marginLeft="4"
    py="2"
    px="4"
    bg="blue.500"
    color="white"
    rounded="lg"
    _hover={{ bg: "blue.600" }}
    focusBorderColor="blue.500"
    onClick={sendMessage} // Assuming this is the function to send the message
  >
    Send
  </Button>
  </Flex>
              </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="raleway">
            Click on a user to start Chatting
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
