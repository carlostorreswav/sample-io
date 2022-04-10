import { useContext, useState } from "react"
import {
  CloudCard,
  CloudCardName,
  CloudCardNumber,
  CloudFlex,
  MenuLabel,
  Module,
} from "../styled-components"
import { ToneContext } from "../ToneContext"

const TempoCloud = () => {
  const { Clouds, CloudFilter } = useContext(ToneContext)
  // console.log("Clouds", Clouds)
  const [open, setOpen] = useState(true)
  return (
    <Module>
      <MenuLabel open={open} center bold onClick={() => setOpen(!open)}>
        Filter by Tempo
      </MenuLabel>
      <CloudFlex open={open}>
        {Clouds?.Tempos?.map((Tempo, idx) => (
          <CloudCard
            hasSamples={Tempo.ids.length > 0}
            key={idx}
            onClick={() => CloudFilter(Tempo.ids)}
          >
            <CloudCardName>{Tempo.name}</CloudCardName>
            <CloudCardNumber>{Tempo.ids.length}</CloudCardNumber>
          </CloudCard>
        ))}
      </CloudFlex>
    </Module>
  )
}

export default TempoCloud
