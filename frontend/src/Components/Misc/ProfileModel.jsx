import React from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import { useState, useContext } from "react";
import { UserContext } from "../Context/ChatProvider";
import { useHistory } from "react-router-dom";


import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  IconButton,
  ModalOverlay,
  ModalBody,
  Button,
  Image,
  Text,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
function ProfileModel({ user, children }) {
  const { users, setUsers } = useContext(UserContext);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();
  
  return (
    <>
      {children ? (
        <>
        <span onClick={onOpen}>{children}</span>
        </>
      ) : (
        <IconButton icon={<ViewIcon />} onClick={onOpen}/>
      )}
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalOverlay
          bg="none"
          backdropFilter="auto"
          backdropInvert="80%"
          backdropBlur="2px"
        />
        <ModalContent>
          <ModalHeader fontSize="20px" fontFamily="raleway" textAlign="center">
            {user?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexDir="column"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user?.img}
              alt={user?.name}
            ></Image>
            <Text fontSize={{ base: "20px", md: "25px" }} pt="10px" pb="20px">
              Email : {user?.email}
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProfileModel;
