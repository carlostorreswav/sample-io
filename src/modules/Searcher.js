// import { useContext, useState } from "react"
import styled from "styled-components"
import { Button } from "../styled-components"
// import { ToneContext } from "../ToneContext"

const CustomInput = styled.input`
  border: none;
  width: 100px;
  border-radius: 4px;
  padding: 4px 8px;
  background-color: #00000077;
  color: #fff;
  &:hover {
    background-color: #00000099;
    color: #fff;
  }
  &:focus {
    outline: none;
  }
`

// const CustomForm = styled.form`
//   width: 100%;
//   margin-bottom: 4px;
// `

const SearchDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`

const Searcher = props => {
  const { changeRef, onChange } = props
  // const { doSearch } = useContext(ToneContext)
  // const [str, setStr] = useState("")

  // const handleSearch = e => {
  //   e.preventDefault()
  //   e.stopPropagation()
  //   const res = doSearch(str.toLowerCase())
  //   console.log("res", res)
  // }

  return (
    <>
      <SearchDiv>
        <CustomInput
          type="text"
          onChange={e => onChange(e.target.value)}
          onClick={e => changeRef()}
          placeholder="Search"
        ></CustomInput>
        <Button noMinWidth>Clear</Button>
      </SearchDiv>
      {/* {numResults ? <Label px={"12px"}>{numResults} results</Label> : null} */}
    </>
  )
}

export default Searcher
