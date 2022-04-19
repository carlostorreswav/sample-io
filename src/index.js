import React from "react"
import { GlobalStyle } from "./styled-components"
import { createRoot } from "react-dom/client"
import AppIndex from "./AppIndex"
import WebIndex from "./WebIndex"
const container = document.getElementById("root")
const root = createRoot(container) // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
    <GlobalStyle />
    {process.env.REACT_APP_WEB ? <WebIndex /> : <AppIndex />}
  </React.StrictMode>
)
