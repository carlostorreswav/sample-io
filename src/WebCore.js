// import React, { createContext, useRef, useState } from "react"
// import { EmptyTone, possibleToneNames, TempoDic } from "./constants"
// export const ToneContext = createContext({})

// export const ToneProvider = ({ children }) => {
//   const [TrackList, setTrackList] = useState([])
//   const [Loader, setLoader] = useState({
//     Samples: 0,
//     Folders: 0,
//     Scaning: false,
//     SamplesOK: 0,
//     Processing: false,
//   })
//   const [Tags, setTags] = useState({
//     loop: [],
//     kick: [],
//     snare: [],
//     hat: [],
//     short: [],
//     long: [],
//   })
//   const [Filter, setFilter] = useState([])
//   const [Tones, setTones] = useState([])
//   const [Tempos, setTempos] = useState([])
//   const [App, setApp] = useState({
//     ready: false,
//     tempoCloud: false,
//     toneCloud: false,
//     tagCloud: false,
//     sampleCloud: false,
//   })

//   const stAudio = useRef(new Audio())

//   // 💾 Get sample Folder 💾
const getOnlyWAVFiles = async (dirHandle, out) => {
  for await (const entry of dirHandle.values()) {
    if (entry.kind === "file") {
      const file = await entry.getFile()
      if (file.name.endsWith(".wav")) {
        out[file.name] = file
        // setLoader(p => ({ ...p, Samples: p.Samples + 1 }))
      }
    }
    if (entry.kind === "directory") {
      const newOut = (out[entry.name] = {})
      //   setLoader(p => ({ ...p, Folders: p.Folders + 1 }))
      await getOnlyWAVFiles(entry, newOut)
    }
  }
}

const cleanEmptyFolders = obj => {
  Object.entries(obj).forEach(([key, value]) => {
    if (Object.values(value).length === 0 && !key.endsWith(".wav")) {
      delete obj[key]
    }
    cleanEmptyFolders(value)
  })
}

export const getSampleFolder = async () => {
  const resFolder = {}
  const RawFolder = await window.showDirectoryPicker()
  // setLoader(p => ({ ...p, Scaning: true }))
  await getOnlyWAVFiles(RawFolder, resFolder)
  await cleanEmptyFolders(resFolder)
  await cleanEmptyFolders(resFolder)
  await cleanEmptyFolders(resFolder)
  return resFolder
}
//   // 💾 Get sample Folder 💾

//   // 🔊 Get samples 🔊
const getTempo = KeyWords => {
  let resTempo = null
  KeyWords.forEach(key => {
    if (key.includes("bpm")) {
      resTempo = key.replace("bpm", "")
    }
    if (parseInt(key) && parseInt(key) >= 60 && parseInt(key) <= 160) {
      resTempo = parseInt(key)
    }
  })
  return resTempo
}

const getTone = KeyWords => {
  let resTone = null
  possibleToneNames.forEach(item => {
    item.tags.forEach(tag => {
      if (KeyWords.includes(tag)) {
        resTone = item.name
      }
    })
  })
  return resTone
}

const getDuration = async file => {
  return new Promise((res, rej) => {
    const audio = new Audio(file)
    audio.addEventListener("loadedmetadata", () => {
      res(audio.duration)
    })
    audio.addEventListener("error", () => {
      res("error")
    })
  })
}

const getCategory = (KeyWords, Duration) => {
  if (KeyWords.includes("loop")) {
    return "loop"
  }
  if (KeyWords.includes("snare")) {
    return "snare"
  }
  if (KeyWords.includes("kick")) {
    return "kick"
  }
  if (KeyWords.includes("hat")) {
    return "hat"
  }
  if (Duration < 6) {
    return "short"
  } else {
    return "long"
  }
}

export const getSamples = async Obj => {
  let myRes = []
  const getSamplesLoop = async Obj => {
    for (const item of Object.values(Obj)) {
      if (!!item.name && item.name.endsWith(".wav")) {
        const newID = crypto.randomUUID()
        const fileSrc = URL.createObjectURL(item)
        const KeyWords = ArrayName(item.name)
        const duration = await getDuration(fileSrc)
        const tone = getTone(KeyWords)
        const tempo = getTempo(KeyWords)
        const type = getCategory(KeyWords, duration)
        if (duration !== "error") {
          myRes.push({
            id: newID,
            name: item.name,
            url: fileSrc,
            file: item,
            duration,
            type,
            tone,
            tempo,
          })
        }
        // setLoader(p => ({ ...p, SamplesOK: p.SamplesOK + 1 }))
      } else {
        await getSamplesLoop(item)
      }
    }
  }
  await getSamplesLoop(Obj)
  return myRes
}
//   // 🔊 Get samples 🔊

//   // SAMPLE CLOUD 🚨
//   const getTags = TrackList => {
//     let finalKeys = []
//     TrackList.forEach(Track => {
//       const KeyWords = ArrayName(Track.name)
//       KeyWords.forEach(word => {
//         if (word.length > 2) {
//           if (finalKeys.filter(item => item.name === word).length === 0) {
//             finalKeys.push({
//               name: word,
//               times: 1,
//               idArray: [Track.id],
//             })
//           } else {
//             finalKeys.forEach(item => {
//               if (item.name === word) {
//                 item.idArray.push(Track.id)
//                 item.times = item.idArray.length
//               }
//             })
//           }
//         }
//       })
//     })
//     const result = finalKeys.sort((a, b) => b.times - a.times)
//     return result
//   }

//   const ClassicCatergories = ["short", "long", "snare", "hat", "kick", "loop"]

//   const getSampleCloud = TrackList => {
//     const FilteredArray = ClassicCatergories.map(item => ({
//       [item]: getTags(TrackList.filter(Track => Track.type === item)),
//     }))
//     FilteredArray.forEach(item => {
//       Object.entries(item).forEach(([key, value]) => {
//         setTags(p => ({ ...p, [key]: value }))
//       })
//     })
//   }
//   // SAMPLE CLOUD 🚨

//   // TEMPO CLOUD 🚨
//   const orderTempos = tempoArray => {
//     let dicResult = TempoDic
//     tempoArray.forEach(item => {
//       dicResult.forEach(itemDic => {
//         if (item.name <= itemDic.max && item.name >= itemDic.min) {
//           itemDic.ids = [...itemDic.ids, ...item.idArray]
//         }
//       })
//     })
//     return dicResult
//   }

//   const getTempoCloud = TrackList => {
//     let finalTempos = []
//     TrackList.forEach(Track => {
//       if (Track.tempo) {
//         if (
//           finalTempos.filter(item => parseInt(item.name) === parseInt(Track.tempo)).length === 0
//         ) {
//           finalTempos.push({
//             name: parseInt(Track.tempo),
//             times: 1,
//             idArray: [Track.id],
//           })
//         } else {
//           finalTempos.forEach(item => {
//             if (parseInt(item.name) === parseInt(Track.tempo)) {
//               item.idArray.push(Track.id)
//               item.times = item.idArray.length
//             }
//           })
//         }
//       }
//     })
//     const goodResult = orderTempos(finalTempos)
//     setTempos(goodResult)
//   }
//   // TEMPO CLOUD 🚨

//   // TONE CLOUD 🚨
//   const getConst = result => {
//     let arrayRes = EmptyTone
//     arrayRes.forEach(key => {
//       const majors = result.filter(item => item.name === key.major.name)[0]
//       const minors = result.filter(item => item.name === key.minor.name)[0]
//       key.major.ids = majors && [...majors.idArray]
//       key.minor.ids = minors && [...minors.idArray]
//     })
//     return arrayRes
//   }

//   const getToneCloud = TrackList => {
//     let result = []
//     TrackList.forEach(Track => {
//       if (result.filter(item => item.name === Track.tone).length === 0) {
//         if (Track.tone !== "too short" && Track.tone !== "too long") {
//           result.push({
//             name: Track.tone,
//             times: 1,
//             idArray: [Track.id],
//           })
//         }
//       } else {
//         result.forEach(item => {
//           if (item.name === Track.tone) {
//             item.idArray.push(Track.id)
//             item.times = item.idArray.length
//           }
//         })
//       }
//     })
//     const goodResult = getConst(result)
//     setTones(goodResult)
//   }
//   // TONE CLOUD 🚨

//   // OTHER FUNCTIONS 🚚
//   const PlaySound = async Item => {
//     stAudio.current.src = Item.url
//     stAudio.current.play()
//   }

//   const stopPlayer = () => {
//     stAudio.current.pause()
//   }

const ArrayName = Name => {
  const RawName = Name.split(".")[0]
  const NameLow = RawName.toLowerCase()
  const KeyWords = NameLow.split(/,| |_| |-/)
  return KeyWords
}

//   const doSearch = str => {
//     const result = TrackList.filter(item => {
//       const KeyWords = ArrayName(item.name)
//       const match = KeyWords.filter(word => word.includes(str))
//       return match.length > 0
//     })
//     const justIds = result.map(item => item.id)
//     setFilter(justIds)
//     return justIds.length === 0 ? "No" : justIds.length
//   }

//   const CloudFilter = ids => {
//     setFilter(ids)
//   }
//   // OTHER FUNCTIONS 🚚

// export const CoreStart = async () => {
//     const Folder = await getSampleFolder()
//     console.log('and the Folder is', Folder)
// setLoader(p => ({ ...p, Scaning: false, Processing: true }))
// const SampleList = await getSamples(Folder)
// setTrackList(() => SampleList)
// setLoader(p => ({ ...p, Processing: false }))
// getSampleCloud(SampleList)
// getToneCloud(SampleList)
// getTempoCloud(SampleList)
// setApp(p => ({
//   ...p,
//   ready: true,
//   tempoCloud: true,
//   toneCloud: true,
//   tagCloud: true,
//   sampleCloud: true,
// }))
//   }

//   return (
//     <ToneContext.Provider
//       value={{
//         TrackList,
//         Tags,
//         setTrackList,
//         CoreStart,
//         PlaySound,
//         Loader,
//         Filter,
//         doSearch,
//         Tones,
//         setFilter,
//         Tempos,
//         App,
//         setApp,
//         stopPlayer,
//         CloudFilter,
//       }}
//     >
//       {children}
//     </ToneContext.Provider>
//   )
// }

const possibleToneNames = [
  {
    name: "C_MAJOR",
    label: "C",
    tags: ["cmaj", "c", "cmaj7", "c7", "c9", "cmaj9"],
  },
  {
    name: "C_MINOR",
    label: "Cm",
    tags: ["cmin", "cm", "cminor", "cmin7", "cmin9"],
  },
  {
    name: "D_FLAT_MAJOR",
    label: "C#",
    tags: ["db", "dbmaj", "c#", "c#maj", "c#maj7", "c#7", "c#9", "c#maj9"],
  },
  {
    name: "D_FLAT_MINOR",
    label: "C#m",
    tags: [
      "c#min",
      "c#m",
      "dbmin",
      "dbm",
      "c#minor",
      "dbminor",
      "c#min7",
      "dbmin7",
      "c#min9",
      "dbmin9",
    ],
  },
  {
    name: "D_MAJOR",
    label: "D",
    tags: ["d", "dmaj", "dmaj7", "d7", "d9", "dmaj9"],
  },
  {
    name: "D_MINOR",
    label: "Dm",
    tags: ["dmin", "dm", "dminor", "dmin7", "dmin9"],
  },
  {
    name: "E_FLAT_MAJOR",
    label: "D#",
    tags: ["eb", "ebmaj", "d#", "d#maj", "d#maj7", "d#7", "d#9", "d#maj9"],
  },
  {
    name: "E_FLAT_MINOR",
    label: "D#m",
    tags: [
      "d#min",
      "d#m",
      "ebmin",
      "ebm",
      "d#minor",
      "ebminor",
      "d#min7",
      "ebmin7",
      "d#min9",
      "ebmin9",
    ],
  },
  {
    name: "E_MAJOR",
    label: "E",
    tags: ["emaj", "e", "emaj7", "e7", "e9", "emaj9"],
  },
  {
    name: "E_MINOR",
    label: "Em",
    tags: ["emin", "em", "eminor", "emin7", "emin9"],
  },
  {
    name: "F_MAJOR",
    label: "F",
    tags: ["fmaj", "f", "fmaj7", "f7", "f9", "fmaj9"],
  },
  {
    name: "F_MINOR",
    label: "Fm",
    tags: ["fmin", "fm", "fminor", "fmin7", "fmin9"],
  },
  {
    name: "G_FLAT_MAJOR",
    label: "F#",
    tags: ["f#", "f#maj", "gb", "gbmaj", "gbmaj7", "gb7", "gb9", "gbmaj9"],
  },
  {
    name: "G_FLAT_MINOR",
    label: "F#m",
    tags: [
      "f#min",
      "f#m",
      "gbmin",
      "gbm",
      "f#minor",
      "gbminor",
      "f#min7",
      "gbmin7",
      "f#min9",
      "gbmin9",
    ],
  },
  {
    name: "G_MAJOR",
    label: "G",
    tags: ["gmaj", "g", "gmaj7", "g7", "g9", "gmaj9"],
  },
  {
    name: "G_MINOR",
    label: "Gm",
    tags: ["gmin", "gm", "gminor", "gmin7", "gmin9"],
  },
  {
    name: "A_FLAT_MAJOR",
    label: "G#",
    tags: ["g#", "g#maj", "ab", "abmaj", "abmaj7", "ab7", "ab9", "abmaj9"],
  },
  {
    name: "A_FLAT_MINOR",
    label: "G#m",
    tags: [
      "g#min",
      "g#m",
      "abmin",
      "abm",
      "g#minor",
      "abminor",
      "g#min7",
      "abmin7",
      "g#min9",
      "abmin9",
    ],
  },
  {
    name: "A_MAJOR",
    label: "A",
    tags: ["amaj", "a", "amaj7", "a7", "a9", "amaj9"],
  },
  {
    name: "A_MINOR",
    label: "Am",
    tags: ["amin", "am", "aminor", "amin7", "amin9"],
  },
  {
    name: "B_FLAT_MAJOR",
    label: "A#",
    tags: ["a#", "a#maj", "bb", "bbmaj", "bbmaj7", "bb7", "bb9", "bbmaj9"],
  },
  {
    name: "B_FLAT_MINOR",
    label: "A#m",
    tags: [
      "a#min",
      "a#m",
      "bbmin",
      "bbm",
      "a#minor",
      "bbminor",
      "a#min7",
      "bbmin7",
      "a#min9",
      "bbmin9",
    ],
  },
  {
    name: "B_MAJOR",
    label: "B",
    tags: ["bmaj", "b", "bmaj7", "b7", "b9", "bmaj9"],
  },
  {
    name: "B_MINOR",
    label: "Bm",
    tags: ["bmin", "bm", "bminor", "bmin7", "bmin9"],
  },
]
