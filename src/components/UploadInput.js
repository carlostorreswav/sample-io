import { useRef, useState } from "react"
import styled from "styled-components"

const InputBox = styled.div`
  width: 100%;
  max-width: 200px;
  text-align: center;
  box-shadow: 0px 1px 10px 0px #00000044;
  color: ${p => (!p.dragOn ? "#ffffff66" : "#000000")};
  background-color: ${p => (p.dragOn ? "#ffffff66" : "#00000066")};
  padding: 10px;
  border-radius: 10px;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
`

const RealInput = styled.input`
  display: none;
`

const UploadInput = props => {
  const { closeInput } = props
  const [dragOn, setDragOn] = useState(false)

  //   const { Lander } = useMambo()

  const customHandle = (e, cb) => {
    e.stopPropagation()
    e.preventDefault()
    cb && cb()
  }

  const validWav = preFile => {
    const ext = preFile.name.split(".").pop()
    if (ext !== "wav") {
      alert("only wav files")
    } else if (preFile.size > 200000000) {
      alert("file too heavy")
    } else {
      return true
    }
  }

  const checkFile = preFile => {
    if (validWav(preFile)) {
      closeInput("folder", preFile)
    }
  }

  // Drag & Drop case
  const onDrop = e => {
    e.stopPropagation()
    e.preventDefault()
    let fromInspector = e.dataTransfer.getData("wavName")
    let fromFolder = e.dataTransfer.files[0]
    if (fromInspector) {
      closeInput("insepector", fromInspector)
    } else {
      checkFile(fromFolder)
    }
  }

  // Input Type File case
  const onChange = e => {
    let preFile = e.target.files[0]
    checkFile(preFile)
  }

  const inputRef = useRef()

  return (
    <InputBox
      dragOn={dragOn}
      onClick={() => inputRef.current?.click()}
      onDrop={e => onDrop(e)}
      onDragOver={e => customHandle(e, null)}
      onDragEnter={e => customHandle(e, e => setDragOn(true))}
      onDragLeave={e => customHandle(e, e => setDragOn(false))}
    >
      <RealInput
        id="realInput"
        ref={inputRef}
        type="file"
        style={{ display: "none" }}
        onChange={e => onChange(e)}
      ></RealInput>
      +
    </InputBox>
  )
}

export default UploadInput
