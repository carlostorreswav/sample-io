import styled from "styled-components"

const MainDiv = styled.div`
  text-align: center;
  padding: 4px;
  font-size: 12px;
`

const Footer = () => {
  const handleRedirectNewTab = () => {
    const link = document.createElement("a")
    link.href = "https://www.youtube.com/watch?v=pTqL6pHnAlY"
    link.target = "_blank"
    link.click()
  }

  return <MainDiv onClick={() => handleRedirectNewTab()}>sample-io</MainDiv>
}

export default Footer
