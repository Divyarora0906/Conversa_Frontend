import React, { createContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export const UserContext = createContext();


export const UserProvider = ({ children }) => {
    const history = useHistory();
  const [users, setUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [Chats, setChats] = useState([]);
  const [Notification,setNotification] = useState([]);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('userInfo'));
    
    setUsers(storedUsers);
    if(!users){
       history.push("/")
    }

  }, []);

  

  return (
    <UserContext.Provider value={{ users, setUsers ,selectedChat, setSelectedChat,Chats, setChats , Notification , setNotification}}>
      {children}
    </UserContext.Provider>
  );
};
