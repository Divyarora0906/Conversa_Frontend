import React from 'react'
import { Skeleton, Stack } from '@chakra-ui/react'
function Chatloading() {
  return (
    <>
    <Stack>
        <Skeleton height="65px"/>
        <Skeleton height="65px"/>
        <Skeleton height="65px"/>
        <Skeleton height="65px"/>
        <Skeleton height="65px"/>

        
    </Stack>
    </>
  )
}

export default Chatloading
