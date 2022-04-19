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

const CustomCard = styled(CloudCard)`
  padding: 4px 8px;
  color: ${p => (p.activated ? "#FFF" : "#FFFFFF44")};
  border: 1px solid black;
  margin: 2px;
  cursor: pointer;
`

const ToneCloud = () => {
  const { Clouds, CloudFilter } = useContext(ToneContext)
  const [open, setOpen] = useState(true)
  const [preview, setPreview] = useState({ activated: true, chords: true, bass: false })

  const ChordPreview = tone => {
    const sharpTypo = tone.label.replace("#", "S")
    const mySound = require(`../chords/${preview.chords ? "" : "b_"}${sharpTypo}.mp3`)
    const audio = new Audio(mySound)
    audio.volume = 1
    audio.play()
  }

  const handleClick = (array, tone) => {
    preview.activated && ChordPreview(tone)
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
              onClick={() => handleClick(Tone.major.ids, Tone.major)}
              hasSamples={Tone?.major?.ids?.length > 0}
            >
              <CloudCardName>{Tone.major.label}</CloudCardName>
              <CloudCardNumber>{Tone?.major?.ids?.length || 0}</CloudCardNumber>
            </CloudCard>
            <CloudCard
              onClick={() => handleClick(Tone.minor.ids, Tone.minor)}
              hasSamples={Tone?.minor?.ids?.length > 0}
            >
              <CloudCardName>{Tone.minor.label}</CloudCardName>
              <CloudCardNumber>{Tone?.minor?.ids?.length || 0}</CloudCardNumber>
            </CloudCard>
          </ToneMain>
        ))}
      </CloudFlex>
      <CloudFlex open={open}>
        <CustomCard
          activated={preview.activated}
          onClick={() =>
            preview.activated
              ? setPreview(p => ({ ...p, activated: false, chords: false, bass: false }))
              : setPreview(p => ({ ...p, activated: true, chords: true, bass: false }))
          }
        >
          <CloudCardName>Preview</CloudCardName>
        </CustomCard>
        <CustomCard
          activated={preview.chords}
          onClick={() =>
            preview.activated
              ? setPreview(p => ({ ...p, chords: !p.chords, bass: !p.bass }))
              : setPreview(p => ({ ...p, activated: true, chords: true, bass: false }))
          }
        >
          <CloudCardName>Chords</CloudCardName>
        </CustomCard>
        <CustomCard
          activated={preview.bass}
          onClick={() =>
            preview.activated
              ? setPreview(p => ({ ...p, chords: !p.chords, bass: !p.bass }))
              : setPreview(p => ({ ...p, activated: true, chords: false, bass: true }))
          }
        >
          <CloudCardName>Bass</CloudCardName>
        </CustomCard>
      </CloudFlex>
    </Module>
  )
}

export default ToneCloud
