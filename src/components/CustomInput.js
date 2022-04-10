import { useRef } from "react"
import styled from "styled-components"

const CustomForm = styled.form`
  padding: 5px 10px;
  width: 100px;
`

const NoInput = styled.input`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border: none;
  background-color: transparent;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  width: 100%;
  margin: 0;
  text-align: center;
  &:focus {
    outline: none;
  }
`

const CustomInput = props => {
  const { value, onChange, onBlur } = props

  const handleSubmit = e => {
    e.preventDefault()
    inputRef.current.blur()
    onBlur()
  }

  const inputRef = useRef()
  return (
    <CustomForm onSubmit={e => handleSubmit(e)}>
      <NoInput ref={inputRef} type="text" onChange={e => onChange(e)} value={value} />
    </CustomForm>
  )
}

export default CustomInput
