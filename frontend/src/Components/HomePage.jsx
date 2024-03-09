import React,{useEffect,useContext} from "react";
import { Container, Box, Text, Image, Stack, Input } from "@chakra-ui/react";
import logo from "../assets/logo.png";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
} from "@chakra-ui/react";
import SignUp from "./Signup";
import Login from "./Login";
import { useHistory } from "react-router-dom";
import { UserContext } from "./Context/ChatProvider";

function HomePage() {
  const history = useHistory();
  const {users,setUsers} = useContext(UserContext)
  useEffect(() => {
    const userdata = JSON.parse(localStorage.getItem("userInfo"));
 
    setUsers(userdata);
    if(userdata === null)
    {
      history.push("/");
    }
    else{
      history.push("/chats")
    }
  }, [history]);
  return (
    <>
      <Container
        maxW="sm"
        centerContent
        p="30px 0px 0px 0px"
        minH="xl"
        rounded="3xl"
        bgColor="white"
        marginBottom="20px"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDir="column"
          p="13px"
          rounded="xl"
          boxShadow="inner"
        >
          <Image
            src={logo}
            alt="LOGO"
            borderRadius="full"
            boxSize="100px"
          ></Image>
          <Text fontSize="4xl" fontWeight="600">
            Conversa 
          </Text>
        </Box>
        <Box m="30px 0px 0px 0px">
          <Tabs variant="soft-rounded" colorScheme="green">
            <TabList>
              <Tab width="50%">Sign-up</Tab>
              <Tab width="50%">Login</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>{<SignUp />}</TabPanel>
              <TabPanel w="xs">{<Login />}</TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </>
  );
}

export default HomePage;
