import { useContext, useMemo, useState } from "react"
import styled from "styled-components"
import { CloudFlex, Flex, MenuLabel, Module, noSelect } from "../styled-components"
import { ToneContext } from "../ToneContext"

const TagTitle = styled.div`
  ${noSelect}
  color: #fff;
  border-radius: 4px;
  padding: 4px;
  cursor: pointer;
  font-size: ${p => p.px || "10px"};
  font-weight: ${p => p.bold && "bold"};
  &:hover {
    background-color: #eee;
    color: #000;
  }
  transition: background-color 0.1s ease-in-out, color 0.1s ease-in-out;
`

const HR = styled.hr`
  display: ${p => (p.items ? "block" : "none")};
`

const CloudTagMemo = ({ Cloud, CloudFilter }) => {
  const [selected, setSelected] = useState(0)
  const [open, setOpen] = useState(true)
  const handleClick = idx => {
    setSelected(idx)
    const idArray = Cloud[idx].tags.map(x => x.idArray)
    CloudFilter(idArray.flat())
  }

  const handleTagClick = Tag => {
    CloudFilter(Tag.idArray)
  }

  return (
    <Module>
      <MenuLabel open={open} center bold onClick={() => setOpen(!open)}>
        Filter by Category
      </MenuLabel>
      <CloudFlex open={open} noFlex>
        <Flex>
          {Cloud?.map((item, idx) => (
            <TagTitle px={"12px"} hasSamples bold key={idx} onClick={() => handleClick(idx)}>
              {item.name}
            </TagTitle>
          ))}
        </Flex>
        <HR items={Cloud} />
        <Flex>
          {Cloud &&
            Cloud[selected]?.tags?.map((Tag, TagIdx) => (
              <TagTitle hasSamples bold key={TagIdx} onClick={() => handleTagClick(Tag)}>
                {Tag.name}
              </TagTitle>
            ))}
        </Flex>
        <HR items={Cloud} />
      </CloudFlex>
    </Module>
  )
}

const TagCloud = () => {
  const { Clouds, CloudFilter } = useContext(ToneContext)
  const CloudTagMemoProc = useMemo(
    () => <CloudTagMemo Cloud={Clouds.Tags} CloudFilter={CloudFilter} />,
    [Clouds, CloudFilter]
  )

  return <>{CloudTagMemoProc}</>
}

export default TagCloud
