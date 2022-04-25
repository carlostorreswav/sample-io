import React from "react"
import MainScreen from "./MainScreen"
import { ToneProvider } from "./ToneContext"
import styled from "styled-components"

const MainFlex = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 99vh;
`

const MainWrapper = styled.div`
  width: 100%;
  margin: 1%;
  height: 100%;
`

const MainBox = styled.div`
  width: 100%;
  display: flex;
  @media (max-width: 1000px) {
    display: block;
  }
`

const MainScreenWrapper = styled.div`
  box-shadow: 10px 20px 50px 10px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  border: 1px solid #645f6822;
  width: 200px;
  min-width: 230px;
  margin: 20px auto;
  height: 85vh;
  overflow: hidden;
`

const WebScreenWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 30px;
  @media (max-width: 1000px) {
    width: auto;
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
  height: ${props => (props.short ? "40px" : "80px")};
  font-size: 2em;
  user-select: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 4px 8px;
  margin: 5px ${p => p.center && "auto"};
  margin: 0 auto;
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

const CustomFrame = styled.iframe`
  width: 500px;
  height: ${p => (p.open ? "300px" : "0px")};
  border: none;
  box-shadow: 0px 10px 40px 0px rgba(0, 0, 0, 0.5);
  @media (max-width: 1200px) {
    width: 350px;
  }
  transition: height 0.5s ease-in-out;
`

const MainMenuBox = styled.div`
  display: flex;
  height: 28px;
  background-color: #2c2632;
  border: 1px solid #645f6822;
`

const ButtonWrapper = styled.div`
  display: flex;
  margin: 4px;
`

const MenuButton = styled.div`
  border-radius: 50%;
  width: 12px;
  height: 12px;
  background-color: ${p => p.color};
  margin: 4px;
`

const MenuTitle = styled.div`
  text-align: center;
  font-size: 1.2em;
  font-weight: bold;
  margin: 6px 21px;
`

const WebIndex = () => {
  const [open, setOpen] = React.useState(false)
  React.useEffect(() => {
    setTimeout(() => {
      setOpen(true)
    }, 100)
  }, [])
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
                  <H1>This a quick demo of the software with no sound</H1>
                </div>
              </WebScreenWrapper>
              <MainScreenWrapper>
                <MainMenuBox>
                  <ButtonWrapper>
                    <MenuButton color="#ED685D" />
                    <MenuButton color="#F5C154" />
                    <MenuButton color="#5CC95D" />
                  </ButtonWrapper>
                  <MenuTitle>sample-io</MenuTitle>
                </MainMenuBox>
                <MainScreen />
              </MainScreenWrapper>
              <WebScreenWrapper>
                <div>
                  <WebButton minWidth="200px">
                    <a
                      href="https://hazeltest.vercel.app/download"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      DOWNLOAD .DMG INSTALLER
                    </a>
                  </WebButton>
                  <br />
                  <br />
                  <CustomFrame open={open} src="https://hazeltest.vercel.app/"></CustomFrame>
                  <br />
                  <br />
                  <br />
                  <WebButton short>
                    <a
                      href="https://github.com/carlostorreswav/sample-io"
                      style={{ textDecoration: "none", color: "inherit" }}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
                    </a>
                  </WebButton>
                </div>
              </WebScreenWrapper>
            </MainBox>
          </MainWrapper>
        </MainFlex>
      </ToneProvider>
    </>
  )
}

export default WebIndex
