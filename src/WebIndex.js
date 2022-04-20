import React from "react"
import MainScreen from "./MainScreen"
import { ToneProvider } from "./ToneContext"
import styled from "styled-components"

const MainWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid red;
  min-height: calc(100vh - 2px);
  margin: 0px;
  overflow: hidden;
`

const MainScreenWrapper = styled.div`
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
`

const WebScreenWrapper = styled.div`
  width: 100%;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
`

const MainBox = styled.div`
  width: 100%;
  height: 96vh;
  margin: 1%;
  display: flex;
  @media (max-width: 768px) {
    display: block;
  }
`

const WebIndex = () => {
  return (
    <>
      <ToneProvider>
        <MainWrapper>
          <MainBox>
            <WebScreenWrapper>
              <h1>WEB</h1>
            </WebScreenWrapper>
            <MainScreenWrapper>
              <MainScreen />
            </MainScreenWrapper>
          </MainBox>
        </MainWrapper>
      </ToneProvider>
    </>
  )
}

export default WebIndex
