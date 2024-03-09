import { useState } from 'react'
import './App.css'
import { Button, ButtonGroup } from '@chakra-ui/react'
import {Route} from "react-router-dom"
import HomePage from './Components/HomePage'
import Chats from './Components/Chats'
function App() {
  return (
    <>
    <div className='App' >
      <Route path="/"  component={HomePage} exact/>
      <Route path="/chats" component={Chats}/>
    </div>
    </>
  )
}

export default App
