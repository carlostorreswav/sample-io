import { useContext, useState } from "react"
import styled from "styled-components"
import { Button, Flex } from "../styled-components"
import { ToneContext } from "../ToneContext"
import Slider from "rc-slider"
import "rc-slider/assets/index.css"

const Card = styled.div`
  border: 1px solid grey;
  margin: 4px;
  padding: 4px;
  border-radius: 10px;
  background-color: #00000033;
`

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Body = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`

const Name = styled.div`
  padding: 2px 4px;
  font-weight: bold;
  text-align: ${p => p.center && "center"};
`
const Equis = styled.div`
  padding: 2px 4px;
  margin: 2px;
  border: 1px solid grey;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background-color: white;
    color: black;
  }
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
`

const SliderWrapper = styled.div`
  padding: 10px;
  height: 80px;
  display: flex;
  justify-content: center;
`

const ParamCard = styled.div`
  border: 1px solid grey;
  padding: 4px;
  border-radius: 4px;
  margin: 2px;
`

const Plugins = () => {
  const { fx, setSelFx, selFx, addPlugin, removePlugin, handleRender } = useContext(ToneContext)

  const handleClick = Plugin => {
    addPlugin(Plugin)
  }

  const handleEquis = idx => {
    removePlugin(idx)
  }

  const getStepValue = (array, raw_value) => {
    const index = Math.floor(array.length * raw_value)
    return array[index]
  }

  const beatuify = (value, param) => {
    let res = value
    if (param.type === "step") {
      res = getStepValue(param.values, value / 100)
    }
    return res
  }

  const handleAfterChange = (value, sIdx, pIdx, param) => {
    // console.log("handleAfterChange", value, sIdx, pIdx, param)
    setSelFx(p => {
      const newFx = [...p]
      newFx[sIdx].params[pIdx].value = value
      const paramName = newFx[sIdx].params[pIdx].name
      newFx[sIdx].plugin.set({ [paramName]: beatuify(value, param) })
      const aver = Object.entries(newFx[sIdx].plugin)
      aver.forEach(a => {
        // console.log("a[1].name", a[1].name)
        // console.log("porsiacaso ", a)
        if (a[1].name === "Signal") {
          // console.log("VALUE ===>", a[1].value)
          // console.log("MIN ===>", a[1].minValue)
          // console.log("MAX ===>", a[1].maxValue)
          // if (a[1].maxValue === 3.4028234663852886e38) {
          //   console.log("LO CONVERTIMOS")
          // }
        }
      })
      return newFx
    })
  }

  // const handleRender = () => {
  //   console.log("handleRender")
  // }

  return (
    <>
      <Flex>
        {fx &&
          fx.map((Plugin, idx) => (
            <Button key={idx} onClick={() => handleClick(Plugin)}>
              {Plugin.name}
            </Button>
          ))}
      </Flex>
      <Button onClick={() => handleRender()}>RENDER</Button>
      <Flex>
        {selFx &&
          selFx.map((Plugin, sIdx) => (
            <Card key={sIdx}>
              <Head>
                <Name>{Plugin.name}</Name>
                <Equis onClick={() => handleEquis(sIdx)}>X</Equis>
              </Head>
              <Body>
                {Plugin.params.map((param, pIdx) => (
                  <ParamCard key={pIdx}>
                    <Name center>{param.name}</Name>
                    <SliderWrapper>
                      <Slider
                        vertical={true}
                        min={param.minValue}
                        max={param.maxValue}
                        step={param.step}
                        defaultValue={param.value}
                        onChange={e => handleAfterChange(e, sIdx, pIdx, param)}
                      />
                    </SliderWrapper>
                    <Name center>{param.value}</Name>
                    <Name center>Min: {param.minValue}</Name>
                    <Name center>Max: {param.maxValue}</Name>
                    <Name center>Step: {param.step}</Name>
                  </ParamCard>
                ))}
              </Body>
            </Card>
          ))}
      </Flex>
    </>
  )
}

export default Plugins
