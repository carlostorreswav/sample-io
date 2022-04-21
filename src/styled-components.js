import styled, { createGlobalStyle, css, keyframes } from "styled-components"

const SrollBar = css`
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 4px; /* for vertical scrollbars */
    height: 0px; /* for horizontal scrollbars */
  }

  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.5);
  }
`

export const GlobalStyle = createGlobalStyle`
  body {
    scroll-behavior: smooth;
    font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
    font-size: 10px;
    background-color: #23272E;
    color: white;
  }
  body, html{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    background-repeat: no-repeat;
    background-attachment: fixed;
}
`

export const noSelect = css`
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
`

export const Button = styled.div`
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

export const Equis = styled.div`
  color: #ffffffaa;
  background-color: tomato;
  font-weight: bold;
  width: fit-content;
  padding: 2px 4px;
  font-size: 12px;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0px 1px 10px 0px #00000011;
  &:hover {
    box-shadow: 0px 1px 10px 0px #00000044;
    background-color: red;
    color: #fff;
  }
  transition: all 0.2s ease-in-out;
`

// GRID SISTEM
export const MainGrid = styled.div`
  height: ${process.env.REACT_APP_WEB ? "100%" : "100vh"};
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: min-content 1fr min-content min-content;
  overflow: hidden;
`

export const GridItem = styled.div`
  border: 1px solid black;
  overflow-y: ${p => (p.scroll ? "auto" : "hidden")};
  width: ${p => p.width || "100%"};
  ${SrollBar}
`

export const TrackGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  height: 80px;
  border: 1px solid black;
`

export const Label = styled.div`
  text-align: ${p => p.align || "center"};
  font-weight: ${p => (p.bold ? "bold" : "normal")};
  font-size: ${p => p.px || "10px"};
  color: ${p => p.color || "white"};
  padding: ${p => p.padding || "5px 10px"};
`

export const MenuLabel = styled.div`
  ${noSelect}
  text-align: ${p => p.align || "center"};
  font-weight: ${p => (p.bold ? "bold" : "normal")};
  font-size: ${p => p.px || "10px"};
  color: ${p => p.color || "white"};
  padding: ${p => p.padding || "5px 10px"};
  cursor: pointer;
  border: 1px solid #111;
  background-color: ${p => (p.open ? "#00000088" : "#ffffff33")};
  &:hover {
    background-color: #eee;
    color: #000;
  }
  transition: background-color 0.1s ease-in-out, color 0.1s ease-in-out;
`

export const Flex = styled.div`
  display: ${p => !p.noFlex && "flex"};
  justify-content: ${p => p.justify || "center"};
  align-items: ${p => !p.noAlign && "center"};
  flex-wrap: ${p => !p.noWrap && "wrap"};
`

export const CloudCard = styled.div`
  ${noSelect}
  padding: 2px;
  /* margin: 4px; */
  color: ${p => (p.hasSamples ? "#fff" : "#777")};
  /* border: 1px solid ${p => (p.hasSamples ? "#ccc" : "#111")}; */
  border-radius: 4px;
  cursor: ${p => p.hasSamples && "pointer"};
  background-color: ${p => !p.hasSamples && "#00000033"};
  &:hover {
    background-color: ${p => p.hasSamples && "#eee"};
    color: ${p => p.hasSamples && "#000"};
  }
  transition: background-color 0.1s ease-in-out, color 0.1s ease-in-out;
`

export const CloudCardName = styled.div`
  font-size: 10px;
  font-weight: bold;
  padding: 1px 2px;
  text-align: center;
`

export const CloudCardNumber = styled.div`
  padding: 4px 8px;
  background-color: black;
  border-radius: 8px;
  color: white;
  font-size: 10px;
  width: fit-content;
  margin: 0 auto;
`

export const CloudFlex = styled.div`
  ${noSelect}
  display: ${p => !p.noFlex && "flex"};
  justify-content: center;
  flex-wrap: wrap;
  text-align: center;
  align-items: center;
  height: ${p => (p.open ? "auto" : "0px")};
  overflow: hidden;
  margin-top: ${p => (p.open ? "8px" : "0px")};
  margin-bottom: ${p => (p.open ? "8px" : "0px")};
  transition: margin-top 0.1s ease-in-out, margin-bottom 0.1s ease-in-out;
`

export const Module = styled.div`
  /* margin-bottom: 4px;
  margin-top: 4px; */
  max-width: 1000px;
  margin: 0 auto;
`

export const fadeInAnimation = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`

export const FadeIn = css`
  animation: ${fadeInAnimation} 0.1s ease-in-out;
`
