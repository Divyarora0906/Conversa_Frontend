import { useState } from "react";
import axios from "axios"
import { useHistory } from "react-router-dom";

import {
  InputGroup,
  FormControl,
  FormLabel,
  Input,
  VStack,
  InputRightElement,
  Button,
  useToast 
} from "@chakra-ui/react";

function SignUp() {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [img, setImg] = useState(null);
  const toast = useToast();
  const history = useHistory();


  const CallShow = () => {
    setShow(!show);
  };

  const PostDetails = async () => {
    setLoading(true);
    if (!img) {
      toast({
        title: "Please Select a Picture",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top"
      });
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("file", img);
    data.append("upload_preset", "Chat_APP");
    data.append("cloud_name", "dbwyexls4");

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dbwyexls4/image/upload", {
        method: "POST",
        body: data,
      });
      const imageData = await response.json();
      console.log("Uploaded Image URL:", imageData.url);
      setImg(imageData.url);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error Uploading Image",
        description: "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top"
      });
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
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

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top"
      });
      return;
    }

    try{
       const config = {
        headers:{
          "Content-type" : "application/json",
        },
      };
      const data = await axios.post("https://conversa-backend-659q.onrender.com/api/user", {name,email,password,img},config);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top"
      });

      localStorage.setItem("userInfo",JSON.stringify(data));
  
      setLoading(false);
      history.push("/chats");


    }
    catch(err){
      toast({
        title: "Error",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top"
      })
    setLoading(false);
    }

  };

  return (
    <div>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <InputGroup size="sm">
            <Input placeholder="Enter your name" onChange={(e) => setName(e.target.value)} />
          </InputGroup>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <InputGroup size="sm">
            <Input placeholder="Enter your email" type="email" onChange={(e) => setEmail(e.target.value)} />
          </InputGroup>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup size="sm">
            <Input
              placeholder="Enter your password"
              type={show ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement onClick={CallShow} cursor="pointer" pr="20px">
              {show ? "Hide" : "Show"}
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup size="sm">
            <Input
              placeholder="Confirm your password"
              type={show ? "text" : "password"}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <InputRightElement onClick={CallShow} cursor="pointer" pr="20px">
              {show ? "Hide" : "Show"}
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Upload your Picture</FormLabel>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImg(e.target.files[0])}
          />
        </FormControl>
        <Button colorScheme="teal" size="md" onClick={PostDetails} isLoading={loading}>
          Upload Picture
        </Button>
        <Button colorScheme="teal" size="md" onClick={handleSubmit} isLoading={loading}>
          Submit
        </Button>
      </VStack>
    </div>
  );
}

export default SignUp;
