import { useContext, useState, useEffect, useRef } from "react"
import { ToneContext } from "../ToneContext"
import styled, { keyframes } from "styled-components"
import { CloudFlex, FadeIn, MenuLabel, Module, noSelect } from "../styled-components"
import Star from "../icons/Star.svg"
import Searcher from "../modules/Searcher"

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
  cursor: pointer;
  font-size: 10px;
  text-align: center;
  background-color: ${p => (p.selected ? "#ffffff" : "")};
  color: ${p => (p.selected ? "#000000" : "")};
  &:hover {
    background-color: ${p => (p.selected ? "#fff" : "#f0f0f044")};
    color: ${p => (p.selected ? "#000" : "")};
    animation: none;
  }
  animation: ${p => p.actual && !p.selected && highLight} 1s infinite;
`

const TimeDiv = styled.div`
  /* padding: 2px 4px; */
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
`

const IconDiv = styled.div`
  width: 14px;
  height: 14px;
  background-color: ${p => (p.liked ? "#FECB2E" : "#00000044")};
  mask-image: url(${Star});
  cursor: pointer;
  &:hover {
    background-color: #fecb2e;
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

const SampleCloud = () => {
  const [open, setOpen] = useState(true)
  // const [selected, setSelected] = useState({ Track: null, index: null })
  const TrackRef = useRef()
  const IndexRef = useRef()
  const [index, setIndex] = useState(null)

  const { Clouds, PlaySound, PlayStopSound, stopPlayer, player, handleLike } =
    useContext(ToneContext)

  const handleLikeClick = (e, Track) => {
    e.stopPropagation()
    handleLike(Track)
  }

  const handlePlayClick = (TrackItem, TrackIdx) => {
    PlaySound(TrackItem)
    TrackRef.current = TrackItem
    setIndex(TrackIdx)
    SearchRef.current = false
    IndexRef.current = TrackIdx
  }

  const SearchRef = useRef(false)

  const handleKeyDown = event => {
    if (!SearchRef.current) {
      event.preventDefault()
      event.stopPropagation()
      if (event.code === "Space") {
        PlayStopSound(TrackRef.current, true)
      }
      let newIndex = IndexRef.current
      if (event.code === "ArrowUp") {
        newIndex = newIndex - 1
      }
      if (event.code === "ArrowDown") {
        newIndex = newIndex + 1
      }
      if (event.code === "ArrowUp" || event.code === "ArrowDown") {
        setIndex(p => newIndex)
        if (newIndex < 0 && newIndex > Clouds.SamplesFiltered.length - 1) {
          IndexRef.current = newIndex
        }
        const divRef = document.getElementById(`Track-${newIndex}`)
        divRef.scrollIntoView({ behavior: "smooth", block: "center" })
        divRef.click()
      }
      if (event.key === "f") {
        const divRef = document.getElementById(`Track-Like-${newIndex}`)
        divRef.click()
      }
    }
  }

  const getSelected = (TrackItem, TrackIdx) => {
    if (index === TrackIdx) {
      TrackRef.current = TrackItem
      return true
    } else {
      return false
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)

    // cleanup this component
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Module>
      <MenuLabel open={open} center bold onClick={() => setOpen(!open)}>
        Samples
      </MenuLabel>
      <CloudFlex open={open} noFlex>
        <Searcher changeRef={() => (SearchRef.current = true)} />
        {Clouds.SamplesFiltered &&
          Clouds.SamplesFiltered.slice(0, 50).map((TrackItem, TrackIdx) => (
            <MainDiv
              id={`Track-${TrackIdx}`}
              key={TrackIdx}
              onClick={() => handlePlayClick(TrackItem, TrackIdx)}
              // selected={index === TrackIdx}
              selected={getSelected(TrackItem, TrackIdx)}
              draggable
              onDragStart={e => handleOnDrag(e, TrackItem, stopPlayer)}
              actual={player.actual === TrackItem.id}
            >
              <NameDiv>
                <PureName>{beautify(TrackItem.name)}</PureName>

                <Flex>
                  {TrackItem.metadata.duration && (
                    <TimeDiv>{TrackItem.metadata.duration.toFixed(2)}s</TimeDiv>
                  )}
                  <IconDiv
                    id={`Track-Like-${TrackIdx}`}
                    liked={TrackItem?.liked}
                    onClick={e => handleLikeClick(e, TrackItem)}
                  />
                </Flex>
              </NameDiv>
            </MainDiv>
          ))}
      </CloudFlex>
    </Module>
  )
}

export default SampleCloud
