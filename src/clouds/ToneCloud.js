import { useContext, useState } from "react"
import styled from "styled-components"
import {
  CloudCard,
  CloudCardName,
  CloudCardNumber,
  CloudFlex,
  MenuLabel,
  Module,
} from "../styled-components"
import { ToneContext } from "../ToneContext"

const ToneMain = styled.div`
  border: 1px solid #00000044;
  border-radius: 4px;
`

const ToneCloud = () => {
  const { Clouds, CloudFilter } = useContext(ToneContext)
  const [open, setOpen] = useState(true)
  const handleClick = array => {
    CloudFilter(array)
  }

  return (
    <Module>
      <MenuLabel open={open} center bold onClick={() => setOpen(!open)}>
        Filter by Tone
      </MenuLabel>

      <CloudFlex open={open}>
        {Clouds?.Tones?.map((Tone, idx) => (
          <ToneMain key={idx}>
            <CloudCard
              onClick={() => handleClick(Tone.major.ids)}
              hasSamples={Tone?.major?.ids?.length > 0}
            >
              <CloudCardName>{Tone.major.label}</CloudCardName>
              <CloudCardNumber>{Tone?.major?.ids?.length || 0}</CloudCardNumber>
            </CloudCard>
            <CloudCard
              onClick={() => handleClick(Tone.minor.ids)}
              hasSamples={Tone?.minor?.ids?.length > 0}
            >
              <CloudCardName>{Tone.minor.label}</CloudCardName>
              <CloudCardNumber>{Tone?.minor?.ids?.length || 0}</CloudCardNumber>
            </CloudCard>
          </ToneMain>
        ))}
      </CloudFlex>
    </Module>
  )
}

export default ToneCloud
