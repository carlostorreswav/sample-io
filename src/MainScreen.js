import Controller from "./modules/Controller"
import { MainGrid, GridItem } from "./styled-components"
import ToneCloud from "./clouds/ToneCloud"
import TempoCloud from "./clouds/TempoCloud"
import SampleCloud from "./clouds/SampleCloud"
import TagCloud from "./clouds/TagCloud"
import FolderCloud from "./clouds/FolderCloud"
import FavCloud from "./clouds/FavCloud"
// import Matchering from "./clouds/Matchering"

const DAW = () => {
  return (
    <MainGrid>
      <GridItem>
        <Controller />
      </GridItem>
      <GridItem scroll>
        <FolderCloud />
        <ToneCloud />
        <TempoCloud />
        <TagCloud />
        <FavCloud />
        {/* <Matchering /> */}
        <SampleCloud />
      </GridItem>
    </MainGrid>
  )
}

export default DAW
