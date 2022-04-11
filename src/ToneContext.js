import React, { createContext, useEffect, useRef, useState } from "react"

export const ToneContext = createContext({})

export const ToneProvider = ({ children }) => {
  const [Clouds, setClouds] = useState({ Folders: [] })
  // const [actual, setActual] = useState(null)
  const [selFx, setSelFx] = useState([])
  const [Filter, setFilter] = useState([])
  const [player, setPlayer] = useState({ vol: 0.5, playing: false, actual: null })

  const stAudio = useRef()

  const setCustomVol = volume => {
    const newVol = (volume / 100).toFixed(2)
    stAudio.current.volume = newVol
    setPlayer(p => ({ ...p, vol: newVol }))
  }

  const PlayStopSound = (Track, space) => {
    if (playingRef.current && space) {
      stopPlayer()
    } else {
      PlaySound(Track)
    }
  }

  const playingRef = useRef()

  const PlaySound = async Track => {
    if (!stAudio.current) {
      stAudio.current = new Audio()
    }
    const rawData = await window.electron.getRawData(Track.path)
    const newURL = URL.createObjectURL(new Blob([rawData], { type: "audio/wav" }))
    stAudio.current.src = newURL
    stAudio.current.volume = player.vol
    stAudio.current.play()
    playingRef.current = true
    stAudio.current.onended = () => {
      playingRef.current = false
      setPlayer(p => ({ ...p, playing: false, actual: null }))
    }
    // setActual(Track.id)
    setPlayer(p => ({ ...p, actual: Track.id, playing: true }))
  }

  const stopPlayer = () => {
    stAudio.current.pause()
    // setActual(null)
    playingRef.current = false
    setPlayer(p => ({ ...p, playing: false, actual: null }))
  }

  const ArrayName = Name => {
    const RawName = Name.split(".")[0]
    const NameLow = RawName.toLowerCase()
    const KeyWords = NameLow.split(/,| |_| |-/)
    return KeyWords
  }

  const doSearch = str => {
    const result = Clouds.Samples.filter(item => {
      const KeyWords = ArrayName(item.name)
      const match = KeyWords.filter(word => word.includes(str))
      return match.length > 0
    })
    const justIds = result.map(item => item.id)
    CloudFilter(justIds)
    return justIds.length === 0 ? "No" : justIds.length
  }

  const CloudFilter = ids => {
    setFilter(ids)
    const newCloud = Clouds.Samples.filter(TrackItem =>
      ids?.length > 0 ? ids.includes(TrackItem.id) : true
    )
    setClouds(Clouds => ({ ...Clouds, SamplesFiltered: newCloud }))
  }

  const handleLike = async Track => {
    const newTrack = { ...Track, liked: !Track.liked }
    const res = await window.electron.replaceTrack(newTrack)
    const favs = updateFavs(res)
    const newSampleCloud = [...Clouds.Samples]
    const newSampleCloudFiltered = [...Clouds.SamplesFiltered]
    const index = newSampleCloud.findIndex(item => item.id === Track.id)
    const indexFiltered = newSampleCloudFiltered.findIndex(item => item.id === Track.id)
    newSampleCloud[index] = newTrack
    newSampleCloudFiltered[indexFiltered] = newTrack
    setClouds({
      ...Clouds,
      Samples: newSampleCloud,
      SamplesFiltered: newSampleCloudFiltered,
      Favs: favs,
    })
  }

  const updateFavs = Folders => {
    let favs = []
    Folders.forEach(Folder => {
      Folder.sampleCloud.forEach(sample => {
        if (sample.liked) {
          favs.push(sample)
        }
      })
    })
    return favs
  }

  useEffect(() => {
    prevStart()
    window.electron.receive("CLOG", str => console.log(str))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const prevStart = async () => {
    const Folders = await window.electron.getData()
    const idArray = Folders.map(item => item.folderID)
    await setCustomFolder(idArray, { FolderArray: Folders }, true)
  }

  const openFolder = async () => {
    startAudio()
    const Folders = await window.electron.showDialog()
    const idArray = Folders.map(item => item.folderID)
    await setCustomFolder(idArray, { FolderArray: Folders })
  }

  const deleteFolder = async folderID => {
    const Folders = await window.electron.deleteFolder(folderID)
    const idArray = Folders.map(item => item.folderID)
    await setCustomFolder(idArray, { FolderArray: Folders }, true)
  }

  const setCustomFolder = async (IDArray, Folders, firstTime) => {
    let myFolders = []
    myFolders = IDArray?.map(ID => Folders.FolderArray.find(item => item.folderID === ID))
    const favs = updateFavs(Folders.FolderArray)
    if (firstTime) {
      myFolders = [...Folders.FolderArray]
    }
    if (myFolders.length === 1) {
      setClouds(p => ({
        ...p,
        Tempos: myFolders[0].tempoCloud,
        Tones: myFolders[0].toneCloud,
        Samples: myFolders[0].sampleCloud,
        SamplesFiltered: myFolders[0].sampleCloud,
        Tags: myFolders[0].tagCloud,
        Folders: { FolderArray: [...Folders.FolderArray], FoldersActive: [myFolders[0].folderID] },
      }))
    } else {
      const arraySamples = myFolders?.map(item => item.sampleCloud)
      const arrayFlat = arraySamples.flat()
      const mergeTempos = procMergeTempos(myFolders)
      const mergeTones = procMergeTones(myFolders)
      setClouds(p => ({
        ...p,
        Tempos: mergeTempos,
        Tones: mergeTones,
        Samples: arrayFlat,
        SamplesFiltered: arrayFlat,
        Favs: favs,
        Folders: { FolderArray: [...Folders.FolderArray], FoldersActive: IDArray },
      }))
      const customClouds = await window.electron.getClouds(arrayFlat)
      setClouds(p => ({ ...p, Tags: customClouds.tagCloud }))
    }
  }

  const procMergeTempos = myFolders => {
    let result = []
    myFolders.forEach(item => {
      item.tempoCloud.forEach(elm => {
        if (result.filter(resElm => resElm.name === elm.name).length === 0) {
          const newElm = {
            name: elm.name,
            min: elm.min,
            max: elm.max,
            ids: [...elm.ids],
          }
          result.push(newElm)
        } else {
          const index = result.findIndex(resElm => resElm.name === elm.name)
          const newElm = {
            name: elm.name,
            min: elm.min,
            max: elm.max,
            ids: [...result[index].ids, ...elm.ids],
          }
          result[index] = newElm
        }
      })
    })
    return result
  }

  const procMergeTones = myFolders => {
    const Tones = myFolders.map(item => item.toneCloud)
    let result = []
    Tones.forEach(Tone => {
      Tone.forEach((Key, idx) => {
        if (result.filter(resElm => resElm.name === Key.name).length === 0) {
          const newElm = {
            name: Key.name,
            major: {
              name: Key.major.name,
              label: Key.major.label,
              ids: [...(Key.major.ids || [])],
            },
            minor: {
              name: Key.minor.name,
              label: Key.minor.label,
              ids: [...(Key.minor.ids || [])],
            },
          }
          result.push(newElm)
        } else {
          const newElm = {
            name: Key.name,
            major: {
              name: Key.major.name,
              label: Key.major.label,
              ids: [...result[idx].major.ids, ...(Key.major.ids || [])],
            },
            minor: {
              name: Key.minor.name,
              label: Key.minor.label,
              ids: [...result[idx].minor.ids, ...(Key.minor.ids || [])],
            },
          }
          result[idx] = newElm
        }
      })
    })
    return result
  }

  const startAudio = () => !stAudio.current && (stAudio.current = new Audio())

  return (
    <ToneContext.Provider
      value={{
        Clouds,
        // Player
        PlaySound,
        PlayStopSound,
        stopPlayer,
        openFolder,
        player,
        setCustomVol,
        deleteFolder,
        Filter,
        setFilter,
        CloudFilter,
        doSearch,
        selFx,
        setSelFx,
        setCustomFolder,
        // actual,
        handleLike,
      }}
    >
      {children}
    </ToneContext.Provider>
  )
}
