import React from "react"
import styled from "styled-components"

const Filler = styled.div`
  height: 100%;
  width: ${p => p.percent}%;
  background-color: ${p => (p.downloading ? "#5EACA3" : p.processing ? "#DC6046" : "#346297")};
  border-radius: inherit;
  text-align: right;
  transition: width 0.3s ease;
`

const FillerWrap = styled.div`
  border-radius: 10px;
  width: 100%;
  background-color: #ffffff88;
  margin-top: 5px;
  margin-bottom: 5px;
  height: 10px;
  box-shadow: 0px 1px 10px 0px #00000033;
`

const FlexDiv = styled.div`
  display: flex;
  flex-wrap: ${p => !p.noWrap && "wrap"};
  justify-content: ${p => p.jc || "center"};
  align-items: center;
  text-align: center;
  padding: ${p => p.p || "0"};
  margin: ${p => p.m || "0 auto"};
`

const LoaderPer = ({ percent }) => {
  return (
    <>
      <FlexDiv noWrap p="4px">
        <FillerWrap>
          <Filler uploading percent={percent * 100}></Filler>
        </FillerWrap>
      </FlexDiv>
    </>
  )
}

export default LoaderPer
