import React from "react"
import MainScreen from "./MainScreen"
import { ToneProvider } from "./ToneContext"

const AppIndex = () => {
  return (
    <ToneProvider>
      <MainScreen />
    </ToneProvider>
  )
}

export default AppIndex
