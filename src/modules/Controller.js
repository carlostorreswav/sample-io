import { useContext, useMemo } from "react"
import styled from "styled-components"
// import LoadingLabel from "../components/LoadingLabel"
import { Flex } from "../styled-components"
import { ToneContext } from "../ToneContext"
import Pause from "../icons/Pause.svg"
import Slider from "rc-slider"
import "rc-slider/assets/index.css"

const IconDiv = styled.div`
  min-width: 20px;
  height: 20px;
  margin: 4px;
  background-color: ${p => (p.active ? "#FECB2E" : "#00000044")};
  mask-image: url(${Pause});
  mask-repeat: no-repeat;
  cursor: pointer;
`
const SliderWrapper = styled.div`
  padding: 8px;
  width: 90%;
  max-width: 250px;
  display: flex;
`

const NumDiv = styled.div`
  padding: 2px 4px;
  margin-left: 6px;
  font-weight: bold;
`

const ControllerMemo = props => {
  const { stopPlayer, player, setCustomVol } = props

  return (
    <Flex justify="space-between" noWrap>
      <SliderWrapper>
        <Slider
          trackStyle={{
            backgroundColor: "#00000044",
          }}
          railStyle={{
            backgroundColor: "#00000044",
          }}
          handleStyle={{
            borderColor: "#00000044",
          }}
          min={0}
          max={100}
          step={1}
          defaultValue={player.vol * 100}
          onChange={e => setCustomVol(e)}
        />
        <NumDiv>{(player.vol * 100).toFixed(0)}</NumDiv>
      </SliderWrapper>

      <IconDiv active={player.playing} onClick={e => stopPlayer()} />
    </Flex>
  )
}

const Controller = () => {
  const { stopPlayer, player, setCustomVol } = useContext(ToneContext)

  return useMemo(
    () => (
      <ControllerMemo
        {...{
          stopPlayer,
          player,
          setCustomVol,
        }}
      />
    ),
    [stopPlayer, player, setCustomVol]
  )
}

export default Controller
