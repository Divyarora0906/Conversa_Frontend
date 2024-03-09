import { Avatar, Box ,Text} from '@chakra-ui/react'
import React from 'react'

function UserListItem({key , user ,handlefunction}) {
  
  return (
    <>
    <Box
    onClick={handlefunction}
    display="flex"
    bgColor="#E8E8E8"
    cursor="pointer"
    _hover={{
        bg:"#38B2AC",
        color:"white"
    }}
    p={2}
    mb={2}
    borderRadius="lg"
    w="100%"
    >

        <Avatar src={user.img} name={user.name} />
        <Box 
        ml={2}
        >
            <Text>{user.name}</Text>
            <Text>{user.email}</Text>
        </Box>
    </Box>
    </>
  )
}

export default UserListItem
