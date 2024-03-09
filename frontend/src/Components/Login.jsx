import { useContext, useState } from "react";
import React from "react";
import { useHistory } from "react-router-dom"; // Import useHistory
import axios from "axios"; // Import axios
import {
  InputGroup,
  FormControl,
  FormLabel,
  Input,
  VStack,
  InputRightElement,
  useToast,
  Button,
} from "@chakra-ui/react";
import { UserContext } from "./Context/ChatProvider";

function Login() {
  const [show, setshow] = useState(false);
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const[Loading,setLoading] = useState(false);
  const { users, setUsers, selectedChat, setSelectedChat, Chats, setChats } =
  useContext(UserContext);
  const toast = useToast();
  const history = useHistory();
    const CallShow = () => {
        setshow(!show);
      };
      const SubmitHandler = async() => {
        setLoading(true);
        if(!email || !password){
          toast({
            title: "Please Fill All Fields",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top"
          });
          setLoading(false)
          return;
        }
        try{
          const config = {
           headers:{
             "Content-type" : "application/json",
           },
         };
         const data = await axios.post("https://conversa-backend-659q.onrender.com/api/user/login", {email,password},config);
         toast({
           title: "Login Successful",
           status: "success",
           duration: 5000,
           isClosable: true,
           position: "bottom"
         });

         setUsers(data)
        localStorage.setItem("userInfo",JSON.stringify(data));
    
         setLoading(false);
         history.push("/chats");
       }
       catch(err){
         toast({
           title: "Error",
           status: "warning",
           duration: 5000,
           isClosable: true,
           position: "top"
         })
       setLoading(false);
       }
   
      };
 
  return (
    <>
    <VStack>
      <FormControl isRequired id="Email">
        <FormLabel>Email</FormLabel>
        <InputGroup size="sm">
          <Input
            placeholder=""
            size="xl"
            type="email"
            onChange={(e) => setemail(e.target.value)}
          />
        </InputGroup>
      </FormControl>
      <FormControl isRequired id="Password">
        <FormLabel>Password</FormLabel>
        <InputGroup size="sm">
          <Input
            placeholder=""
            size="xl"
            type={show ? "text" : "password"}
            onChange={(e) => setpassword(e.target.value)}
          />
          <InputRightElement onClick={CallShow} mr="10px" cursor="pointer">
            {show ? "Hide" : "Show"}
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button colorScheme="teal" size="md" mt="20px" id="Btn" onClick={SubmitHandler} w="50%" isLoading={Loading}>
          Submit
        </Button>
      </VStack>
    </>
  );
}

export default Login;
