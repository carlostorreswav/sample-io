import * as Tone from "tone"

const getDefaultParams = Plugin => {
  let params = []
  const entries = Object.entries(Plugin)
  entries.forEach(a => {
    if (a[1].name === "Signal" || a[1].name === "Param") {
      const name = a[0]
      const value = a[1].value
      const minValue = a[1].minValue
      const maxValue = a[1].maxValue
      const step = (maxValue - minValue) / 100
      params.push({ name, value, minValue, maxValue, step })
      if (a[1].maxValue === 3.4028234663852886e38) {
        console.log("LO CONVERTIMOS")
      }
    }
  })
  return params
}

export const getDefaultSchema = () => [
  // Chorus
  {
    name: "Chorus",
    plugin: new Tone.Chorus(),
    params: getDefaultParams(new Tone.Chorus()),
  },
  // Delay
  {
    name: "Delay",
    plugin: new Tone.FeedbackDelay(),
    params: getDefaultParams(new Tone.FeedbackDelay()),
  },
  // Distortion
  {
    name: "Distortion",
    plugin: new Tone.Distortion(),
    params: getDefaultParams(new Tone.Distortion()),
  },
  // Freeverb
  {
    name: "Freeverb",
    plugin: new Tone.Freeverb(),
    params: getDefaultParams(new Tone.Freeverb()),
  },
  // Phaser
  {
    name: "Phaser",
    plugin: new Tone.Phaser(),
    params: getDefaultParams(new Tone.Phaser()),
  },
  // Limiter
  {
    name: "Limiter",
    plugin: new Tone.Limiter(),
    params: getDefaultParams(new Tone.Limiter()),
  },
  // PitchShift
  {
    name: "PitchShift",
    plugin: new Tone.PitchShift(),
    params: getDefaultParams(new Tone.PitchShift()),
  },
  // Filter
  {
    name: "Filter",
    plugin: new Tone.Filter(),
    params: getDefaultParams(new Tone.Filter()),
  },
  // StereoWidener
  {
    name: "StereoWidener",
    plugin: new Tone.StereoWidener(),
    params: getDefaultParams(new Tone.StereoWidener()),
  },
]

function bufferToWave(abuffer, len) {
  var numOfChan = abuffer.numberOfChannels,
    length = len * numOfChan * 2 + 44,
    buffer = new ArrayBuffer(length),
    view = new DataView(buffer),
    channels = [],
    i,
    sample,
    offset = 0,
    pos = 0

  // write WAVE header
  setUint32(0x46464952) // "RIFF"
  setUint32(length - 8) // file length - 8
  setUint32(0x45564157) // "WAVE"

  setUint32(0x20746d66) // "fmt " chunk
  setUint32(16) // length = 16
  setUint16(1) // PCM (uncompressed)
  setUint16(numOfChan)
  setUint32(abuffer.sampleRate)
  setUint32(abuffer.sampleRate * 2 * numOfChan) // avg. bytes/sec
  setUint16(numOfChan * 2) // block-align
  setUint16(16) // 16-bit (hardcoded in this demo)

  setUint32(0x61746164) // "data" - chunk
  setUint32(length - pos - 4) // chunk length

  // write interleaved data
  for (i = 0; i < abuffer.numberOfChannels; i++) channels.push(abuffer.getChannelData(i))

  while (pos < length) {
    for (i = 0; i < numOfChan; i++) {
      // interleave channels
      sample = Math.max(-1, Math.min(1, channels[i][offset])) // clamp
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0 // scale to 16-bit signed int
      view.setInt16(pos, sample, true) // write 16-bit sample
      pos += 2
    }
    offset++ // next source sample
  }

  // create Blob
  return new Blob([buffer], { type: "audio/wav" })

  function setUint16(data) {
    view.setUint16(pos, data, true)
    pos += 2
  }

  function setUint32(data) {
    view.setUint32(pos, data, true)
    pos += 4
  }
}

// const addPlugin = Plugin => {
//   const newArray = [...selFx]
//   newArray.push(Plugin)
//   const PluginArray = newArray.map(elm => elm.plugin)
//   stTone.current.disconnect()
//   stTone.current.chain(...PluginArray, Tone.Destination)
//   setSelFx(newArray)
// }

// const removePlugin = idx => {
//   let newArray = [...selFx]
//   newArray[idx].plugin.set({ wet: 0 })
//   newArray = newArray.filter((elm, i) => i !== idx)
//   const PluginArray = newArray.map(elm => elm.plugin)
//   stTone.current.disconnect()
//   stTone.current.chain(...PluginArray, Tone.Destination)
//   setSelFx(newArray)
// }

// const PlaySound = async Track => {
//   const rawData = await window.electron.getRawData(Track.path)
//   const newURL = URL.createObjectURL(new Blob([rawData], { type: "audio/wav" }))
//   songRef.current = newURL
//   stTone.current.stop()
//   stTone.current.load(newURL)
//   stTone.current.volume.input.value = vol
//   const PluginArray = selFx.map(elm => elm.plugin)
//   stTone.current.disconnect()
//   stTone.current.chain(...PluginArray, Tone.Destination)
//   stTone.current.autostart = true
//   stTone.current.loop = true
// }

// const handleRender = async () => {
//   const buffer = await Tone.Buffer.fromUrl(songRef.current)
//   Tone.Offline(() => {
//     const sample = new Tone.Player().toDestination()
//     const defSchema = getDefaultSchema()
//     sample.buffer = buffer

//     const PluginArray = defSchema.map(elm => elm.plugin)
//     sample.chain(...PluginArray, Tone.Destination)

//     sample.start(0)
//     // })
//   }, 7).then(buffer => {
//     console.log("buffer", buffer)
//     const blob = bufferToWave(buffer, buffer.length)
//     const url = URL.createObjectURL(blob)
//     console.log("url", url)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = "test.wav"
//     a.click()
//   })
// }
