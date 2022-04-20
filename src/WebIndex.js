import React from "react"
import MainScreen from "./MainScreen"
import { ToneProvider } from "./ToneContext"
import styled from "styled-components"

const MainFlex = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`

const MainWrapper = styled.div`
  width: 100%;
  /* border: 1px solid red; */
  /* min-height: calc(100vh - 12px); */
  margin: 1%;
  /* overflow: hidden; */
  /* height: 100vh; */
`

const MainScreenWrapper = styled.div`
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.5);
  width: 200px;
  min-width: 200px;
  margin: 20px auto;
  height: 80%;
`

const WebScreenWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const MainBox = styled.div`
  width: 100%;
  /* height: calc(100% - 100px); */
  height: 90vh;
  /* padding: 1%; */
  display: flex;
  @media (max-width: 768px) {
    display: block;
  }
`

const MainTitle = styled.div`
  text-align: center;
  font-size: 2em;
`

const H1 = styled.h1`
  font-size: 2em;
  font-weight: bold;
  padding-top: 8px;
`

const WebButton = styled.div`
  height: 100px;
  font-size: 2em;
  user-select: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 4px 8px;
  margin: 5px ${p => p.center && "auto"};
  transition: padding 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  box-shadow: 0px 1px 10px 0px #00000011;
  min-width: ${p => (p.minWidth ? p.minWidth : p.noMinWidth ? "none" : "120px")};
  max-width: 180px;
  text-align: center;
  background-color: ${p => (p.active ? "#333" : "#ffffff88")};
  color: ${p => (p.active ? "#fff" : "#282c34")};
  border: ${p => (p.active ? "1px solid #fff" : "1px solid #ffffff55")};
  &:hover {
    background-color: #fff;
    color: #222;
    border: 1px solid #fff;
    box-shadow: 0px 1px 10px 0px #00000044;
  }
  transition: all 0.2s ease-in-out;
  text-transform: ${p => (p.uppercase ? "uppercase" : "none")};
`

const WebIndex = () => {
  return (
    <>
      <ToneProvider>
        <MainFlex>
          <MainWrapper>
            <MainTitle>
              <h1>sample-io</h1>
            </MainTitle>
            <MainBox>
              <WebScreenWrapper>
                <div>
                  <H1>sample-io is a free macOS desktop app for music producers</H1>
                  <H1>open-source, made with Electron and React</H1>
                  <H1>ultra-tiny size to use beside your favourite DAW</H1>
                  <H1>filter, search and drag and drop your samples in record time</H1>
                  <H1>weekly automatic updates</H1>
                  <br />
                  <br />
                  <H1>This a quick demo of the software</H1>
                </div>
              </WebScreenWrapper>
              <MainScreenWrapper>
                <MainScreen />
              </MainScreenWrapper>
              <WebScreenWrapper>
                <WebButton minWidth="250px">
                  <a href="https://hazeltest.vercel.app/download">
                    DOWNLOAD LATEST INSTALLER <br /> .DMG
                  </a>
                </WebButton>
              </WebScreenWrapper>
            </MainBox>
          </MainWrapper>
        </MainFlex>
      </ToneProvider>
    </>
  )
}

export default WebIndex