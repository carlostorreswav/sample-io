import React from "react"
import MainScreen from "./MainScreen"
import { ToneProvider } from "./ToneContext"

const WebIndex = () => {
  return (
    <>
      <h1>webIndex</h1>
      <ToneProvider>
        <MainScreen />
      </ToneProvider>
    </>
  )
}

export default WebIndex
