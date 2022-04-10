import { useContext, useState } from "react"
import { ToneContext } from "../ToneContext"
import styled, { keyframes } from "styled-components"
import { CloudFlex, FadeIn, MenuLabel, Module, noSelect } from "../styled-components"
import Star from "../icons/Star.svg"

const handleOnDrag = (e, Track, stopPlayer) => {
  e.preventDefault()
  window?.electron?.startDrag(Track)
  stopPlayer()
}

const highLight = keyframes`
  0% {
    background-color: #00000000;
    color:white;
  }
  50% {
    background-color: #ffffff33;
    color:white;
  }
  100% {
    background-color: #00000000;
    color:white;
  }
`

const MainDiv = styled.div`
  ${FadeIn}
  ${noSelect}
  min-height: 100%;
  width: 100%;
  word-wrap: break-word;
  border-radius: 4px;
  font-size: 10px;
  text-align: center;
  &:hover {
    background-color: #f0f0f0;
    color: #000;
    animation: none;
  }
  animation: ${p => p.actual && highLight} 1s infinite;
`

const TimeDiv = styled.div`
  background-color: black;
  border-radius: 2px;
  color: white;
  padding: 2px;
  font-size: 9px;
  margin-right: 2px;
`

const NameDiv = styled.div`
  padding: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const PureName = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding: 4px;
  cursor: pointer;
`

const IconDiv = styled.div`
  width: 14px;
  height: 14px;
  background-color: ${p => (p.liked ? "#FECB2E" : "#00000044")};
  mask-image: url(${Star});
  cursor: pointer;
  &:hover {
    background-color: #000000;
  }
  margin: 2px;
`

const Flex = styled.div`
  display: flex;
  align-items: center;
`

const beautify = name => {
  let resName = ""
  resName = name.split(".wav")[0]
  resName = resName.replace(/_+/g, " ")
  return resName
}

const FavCloud = () => {
  const { Clouds, PlaySound, stopPlayer, actual, handleLike } = useContext(ToneContext)
  const [open, setOpen] = useState(true)
  const handleLikeClick = (e, Track) => {
    e.stopPropagation()
    handleLike(Track)
  }

  return (
    <Module>
      <MenuLabel open={open} center bold onClick={() => setOpen(!open)}>
        Favourites
      </MenuLabel>
      <CloudFlex open={open} noFlex>
        {Clouds.Favs?.length > 0 ? (
          Clouds.Favs.map((TrackItem, TrackIdx) => (
            <MainDiv
              key={TrackIdx}
              onClick={() => PlaySound(TrackItem)}
              draggable
              onDragStart={e => handleOnDrag(e, TrackItem, stopPlayer)}
              actual={actual === TrackItem.id}
            >
              <NameDiv>
                <PureName>{beautify(TrackItem.name)}</PureName>

                <Flex>
                  {TrackItem.metadata.duration && (
                    <TimeDiv>{TrackItem.metadata.duration.toFixed(2)}s</TimeDiv>
                  )}
                  <IconDiv liked={TrackItem?.liked} onClick={e => handleLikeClick(e, TrackItem)} />
                </Flex>
              </NameDiv>
            </MainDiv>
          ))
        ) : (
          <>No Favourites</>
        )}
      </CloudFlex>
    </Module>
  )
}

export default FavCloud
