const mm = require("music-metadata")
const fs = require("fs")
var crypto = require("crypto")
const path = require("path")
const { EmptyTone, possibleToneNames, TempoDic } = require("./constants")

// 🚨 GET SAMPLE CLOUD 🚨
const getLoop = async (dir, files, mainWindow) => {
  let count = { Folders: 0, Samples: 0, Scaning: true }
  return new Promise(async (res, rej) => {
    const CustomLoop = async (dir, files) => {
      const dirFiles = fs.readdirSync(dir)
      for await (const file of dirFiles) {
        var filePath = path.join(dir, file)
        var stat = fs.statSync(filePath)
        if (stat && stat.isDirectory()) {
          count = { ...count, Folders: count.Folders + 1, Scaning: true }
          await CustomLoop(filePath, files)
        } else {
          if (file.slice(-4) === ".wav") {
            const metadata = await mm.parseFile(filePath)
            const format = metadata.format
            const id = crypto.randomUUID()
            const KeyWords = ArrayName(file)
            const tone = getTone(KeyWords)
            const tempo = getTempo(KeyWords)
            const type = getCategory(KeyWords, format.duration)
            files.push({
              path: filePath,
              name: file,
              size: stat.size,
              metadata: format,
              id: id,
              tone: tone,
              tempo: tempo,
              type: type,
            })
            count = { ...count, Samples: count.Samples + 1, Scaning: true }
            mainWindow.webContents.send("sampleProcessing", count)
          }
        }
      }
    }
    await CustomLoop(dir, files)
    res(files)
  })
}

const getSampleCloud = async (dir, mainWindow) => {
  return new Promise(async (res, rej) => {
    let files = []
    const result = await getLoop(dir, files, mainWindow)
    count = { Samples: 0, Folders: 0, Scaning: false }
    mainWindow.webContents.send("sampleProcessing", count)
    res(result)
  })
}
// 🚨 GET SAMPLE CLOUD 🚨

// 🚨 GET TAG CLOUD 🚨
const getTags = samples => {
  let finalKeys = []
  samples.forEach(Track => {
    const KeyWords = ArrayName(Track.name)
    KeyWords.forEach(word => {
      if (word.length > 2) {
        if (finalKeys.filter(item => item.name === word).length === 0) {
          finalKeys.push({
            name: word,
            times: 1,
            idArray: [Track.id],
          })
        } else {
          finalKeys.forEach(item => {
            if (item.name === word) {
              item.idArray.push(Track.id)
              item.times = item.idArray.length
            }
          })
        }
      }
    })
  })
  const result = finalKeys.sort((a, b) => b.times - a.times)
  return result
}

const getTagCloud = samples => {
  const MaxResults = getTags(samples)
  const MaxResultFiltered = MaxResults.filter(item => !parseInt(item.name))
  const FirstResult = MaxResultFiltered.slice(0, 20)
  let finalRes = []
  FirstResult.forEach(item => {
    let tags = []
    samples.forEach(Track => {
      const KeyWords = ArrayName(Track.name)
      if (KeyWords.includes(item.name)) {
        tags.push(Track)
      }
    })
    const res = getTags(tags)
    const onlyNames = FirstResult.map(item => item.name)
    const filterRes = res.filter(it => !onlyNames.includes(it.name) && !parseInt(it.name))
    const goodRes = filterRes.slice(0, 20)
    finalRes = [...finalRes, { name: item.name, tags: goodRes }]
  })
  return finalRes
}
// 🚨 GET TAG CLOUD 🚨

// 🚨 GET TEMPO CLOUD 🚨
const orderTempos = tempoArray => {
  let dicResult = TempoDic()
  tempoArray.forEach(item => {
    dicResult.forEach(itemDic => {
      if (item.name <= itemDic.max && item.name >= itemDic.min) {
        itemDic.ids = [...itemDic.ids, ...item.idArray]
      }
    })
  })
  return dicResult
}

const getTempoCloud = samples => {
  let finalTempos = []
  samples.forEach(Track => {
    if (Track.tempo) {
      if (finalTempos.filter(item => parseInt(item.name) === parseInt(Track.tempo)).length === 0) {
        finalTempos.push({
          name: parseInt(Track.tempo),
          times: 1,
          idArray: [Track.id],
        })
      } else {
        finalTempos.forEach(item => {
          if (parseInt(item.name) === parseInt(Track.tempo)) {
            item.idArray.push(Track.id)
            item.times = item.idArray.length
          }
        })
      }
    }
  })
  const goodResult = orderTempos(finalTempos)
  return goodResult
}
// 🚨 GET TEMPO CLOUD 🚨

// 🚨 GET TONE CLOUD 🚨
const getConst = result => {
  let arrayRes = EmptyTone()
  arrayRes.forEach(key => {
    const majors = result.filter(item => item.name === key.major.name)[0]
    const minors = result.filter(item => item.name === key.minor.name)[0]
    key.major.ids = majors && [...majors.idArray]
    key.minor.ids = minors && [...minors.idArray]
  })
  return arrayRes
}

const getToneCloud = samples => {
  let result = []
  samples.forEach(Track => {
    if (result.filter(item => item.name === Track.tone).length === 0) {
      if (Track.tone !== "too short" && Track.tone !== "too long") {
        result.push({
          name: Track.tone,
          times: 1,
          idArray: [Track.id],
        })
      }
    } else {
      result.forEach(item => {
        if (item.name === Track.tone) {
          item.idArray.push(Track.id)
          item.times = item.idArray.length
        }
      })
    }
  })
  const goodResult = getConst(result)
  return goodResult
}
// 🚨 GET TONE CLOUD 🚨

// OTHER FUNCTIONS 🚨
const ArrayName = Name => {
  const RawName = Name.split(".")[0]
  const NameLow = RawName.toLowerCase()
  const KeyWords = NameLow.split(/,| |_| |-/)
  return KeyWords
}

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
// OTHER FUNCTIONS 🚨

module.exports = {
  getSampleCloud,
  getTagCloud,
  getTempoCloud,
  getToneCloud,
}
