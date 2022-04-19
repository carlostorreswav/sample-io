import { useEffect, useState } from "react"
import styled from "styled-components"

const LoaderLabel = styled.div`
  text-align: center;
  padding: ${props => (props.Scanning ? "4px" : "0px")};
  height: ${props => (props.Scanning ? "auto" : "0px")};
  transition: padding 0.1s ease-in-out;
`

const LoadingLabel = () => {
  const [Loader, setLoader] = useState({ Samples: 0, Folders: 0, Scaning: false })
  useEffect(() => {
    // https://stackoverflow.com/questions/68940343/remove-event-listener-from-preload-js-in-electron-created-by-react-component
    !process.env.REACT_APP_WEB &&
      window.electron.receive("sampleProcessing", data =>
        setLoader(p => ({
          ...p,
          Samples: data.Samples,
          Folders: data.Folders,
          Scaning: data.Scaning,
        }))
      )
  }, [])
  return (
    <LoaderLabel Scanning={Loader.Scaning}>
      {Loader.Scaning && `Scaning ${Loader.Folders} folders and ${Loader.Samples} samples...`}
    </LoaderLabel>
  )
}

export default LoadingLabel
