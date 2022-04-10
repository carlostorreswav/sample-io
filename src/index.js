import React from "react"
import ReactDOM from "react-dom"
import MainScreen from "./MainScreen"
import { GlobalStyle } from "./styled-components"
import { ToneProvider } from "./ToneContext"

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <ToneProvider>
      <MainScreen />
    </ToneProvider>
  </React.StrictMode>,
  document.getElementById("root")
)
