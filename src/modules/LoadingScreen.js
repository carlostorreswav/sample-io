import { useContext } from "react"
import styled from "styled-components"
import { Button } from "../styled-components"
import { ToneContext } from "../ToneContext"
// import LoaderPer from "./LoaderPer"

const MainDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`

const MainMsg = styled.div`
  text-align: center;
  font-size: 20px
  font-weight: bold;
  margin: 10px;
  width: 100%;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 40px;
  `

const LoadingScreen = () => {
  const { Loader, CoreStart, App } = useContext(ToneContext)
  return (
    <MainDiv>
      <MainMsg>
        {!App.ready && !Loader.Scaning && !Loader.Processing && (
          <Button center onClick={() => CoreStart()}>
            OPEN SAMPLE FOLDER
          </Button>
        )}
        {!App.ready &&
          Loader.Scaning &&
          `Scaning ${Loader.Folders} folders and ${Loader.Samples} samples...`}
        {/* {Loader.Processing && `Processed ${Loader.SamplesOK} of ${Loader.Samples} samples`}
        {Loader.Processing && <LoaderPer percent={Loader.SamplesOK / Loader.Samples} />}
        {Loader.Processing && `${((Loader.SamplesOK / Loader.Samples) * 100).toFixed(2)} %`} */}
      </MainMsg>
    </MainDiv>
  )
}

export default LoadingScreen
