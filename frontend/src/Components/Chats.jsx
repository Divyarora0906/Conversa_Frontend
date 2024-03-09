import React,{useContext, useEffect, useState} from 'react'
import { useHistory } from "react-router-dom";
import Sidebar from './Misc/Sidebar';
import { UserContext } from "./Context/ChatProvider";
import {Box} from "@chakra-ui/react"
import MyChats from './Misc/MyChats';
import ChatBox from './Misc/ChatBox';
function Chats() {
  const history = useHistory();
  const {users} = useContext(UserContext);
  const [fetch,fetchAgain] = useState(false);
  useEffect(()=>{
   if(users === null){
      history.push("/")
   }
   else if(users.length === 0){
    history.push("/")
   }
   else{
    history.push("/chats")
   }
  },[])

 
  return (
   <>
   <div className='Chat_Page' style={{marginTop:"-30px"}}>
   {users && <Sidebar />}
    <Box
    display="flex"
    justifyContent="space-between"
    w="100%"
    h="90.5vh"
    >

    {users && <MyChats fetchAgain={fetch} setfetchAgain={fetchAgain}/>}
    {users && <ChatBox fetchAgain={fetch} setfetchAgain={fetchAgain}/>}
    </Box>
   </div>
   </>
  )
}

export default Chats
