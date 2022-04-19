import React from "react"
import MainScreen from "./MainScreen"
import { ToneProvider } from "./ToneContext"
import styled from "styled-components"

const MainWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid red;
  height: calc(100vh - 2px);
  margin: 0px;
  overflow: hidden;
`

const MainScreenWrapper = styled.div`
  height: 94%;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
`

const WebIndex = () => {
  return (
    <>
      <ToneProvider>
        <MainWrapper>
          <MainScreenWrapper>
            <MainScreen />
          </MainScreenWrapper>
        </MainWrapper>
      </ToneProvider>
    </>
  )
}

export default WebIndex
