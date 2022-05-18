import { useContext, useState } from "react"
import { Button, CloudFlex, MenuLabel, Module } from "../styled-components"
import styled from "styled-components"
import { ToneContext } from "../ToneContext"

const CardFlex = styled.div`
  display: flex;
  width: 100%;
`

const Card = styled.div`
  border: 1px solid grey;
  border-radius: 10px;
  padding: 2px;
  margin: 2px;
  width: 100%;
`

const InputBox = styled.div`
  border: 1px dashed grey;
  border-radius: 10px;
  width: 90%;
  margin: 4px auto;
  cursor: pointer;
  &:hover {
    border: 1px dashed #ff0000;
    background-color: #ffffff11;
  }
  transition: border 0.3s ease, background-color 0.3s ease;
`

const InputContainter = styled.div`
  margin: 6px auto;
  word-break: break-all;
  border-radius: 4px;
  cursor: pointer;
  font-size: 10px;
  text-align: center;
`

const Matchering = () => {
  const [open, setOpen] = useState(false)
  const [match, setMatch] = useState({
    reference: { name: "", path: "" },
    target: { name: "", path: "" },
    result: { name: "", path: "" },
  })

  const { PlaySound } = useContext(ToneContext)

  const handleDrop = (type, e) => {
    e.preventDefault()
    const { name, path } = e.dataTransfer.files[0]
    setMatch({ ...match, [type]: { name, path }, result: { name: "", path: "" } })
  }

  const runMatch = async () => {
    const res = await window?.electron?.startMatch(match)
    console.log("AND THE RES IS", res)
    setMatch(p => ({ ...p, result: { name: "RESULT", path: res } }))
  }

  return (
    <Module>
      <MenuLabel open={open} center bold onClick={() => setOpen(!open)}>
        MATCHERING (on development)
      </MenuLabel>
      <CloudFlex open={open}>
        <CardFlex>
          <Card>
            <h3>REFERENCE</h3>
            <InputContainter>
              {match.reference.name ? (
                <>
                  <h4 onClick={() => PlaySound({ path: match.reference.path, id: "matchering" })}>
                    {match.reference.name}
                  </h4>
                  <Button
                    noMinWidth
                    onClick={() =>
                      setMatch(p => ({ ...p, reference: { name: "", id: "", path: "" } }))
                    }
                  >
                    X
                  </Button>
                </>
              ) : (
                <InputBox
                  onDrop={e => handleDrop("reference", e)}
                  onDragOver={e => e.preventDefault()}
                >
                  <h3>+</h3>
                </InputBox>
              )}
            </InputContainter>
          </Card>
          <Card>
            <h3>TARGET</h3>
            <InputContainter>
              {match.target.name ? (
                <>
                  <h4 onClick={() => PlaySound({ path: match.target.path, id: "matchering" })}>
                    {match.target.name}
                  </h4>
                  <Button
                    noMinWidth
                    onClick={() =>
                      setMatch(p => ({ ...p, target: { name: "", id: "", path: "" } }))
                    }
                  >
                    X
                  </Button>
                </>
              ) : (
                <InputBox
                  onDrop={e => handleDrop("target", e)}
                  onDragOver={e => e.preventDefault()}
                >
                  <h3>+</h3>
                </InputBox>
              )}
            </InputContainter>
          </Card>
        </CardFlex>
        <Card>
          {match.reference.path && match.target.path && !match.result.path && (
            <Button onClick={runMatch}>
              <h2>RUN</h2>
            </Button>
          )}
          {!match.reference.path && !match.target.path && <h3>DROP ELEMENTS</h3>}
          {match.reference.path && !match.target.path && <h3>DROP TARGET</h3>}
          {!match.reference.path && match.target.path && <h3>DROP REFERENCE</h3>}
          {match.result.path && (
            <Button onClick={() => PlaySound({ path: match.result.path, id: "matchering" })}>
              {match.result.name}
            </Button>
          )}
        </Card>
      </CloudFlex>
    </Module>
  )
}

export default Matchering
