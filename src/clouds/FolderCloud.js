import { useContext, useMemo, useState } from "react"
import styled from "styled-components"
import LoadingLabel from "../components/LoadingLabel"
import { CloudFlex, Flex, MenuLabel, Module, noSelect, FadeIn } from "../styled-components"
import { ToneContext } from "../ToneContext"

const TagTitle = styled.div`
  ${noSelect}
  color: #fff;
  border-radius: 4px;
  padding: ${p => p.padding || "4px 8px"};
  max-width: ${p => p.maxWidth || "200px"};
  margin: ${p => p.center && "0 auto"};
  cursor: pointer;
  font-size: ${p => p.px || "10px"};
  font-weight: ${p => p.bold && "bold"};
  background: ${p => p.active && "#000"};
  &:hover {
    background-color: #eee;
    color: #000;
  }
  transition: background-color 0.1s ease-in-out, color 0.1s ease-in-out;
`

const Option = styled.div`
  ${noSelect}
  padding: ${p => p.p || "2px 4px"};
  cursor: pointer;
  background-color: black;
  border-radius: 2px;
  color: white;
  font-size: 9px;
  margin-right: 2px;
  &:hover {
    background-color: ${p => p.hover};
  }
`

const NameDiv = styled.div`
  padding: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const PureName = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding: 4px;
`

const PathDiv = styled.div`
  ${FadeIn}
  ${noSelect}
  min-height: 100%;
  width: 100%;
  word-wrap: break-word;
  border-radius: 4px;
  font-size: 10px;
  text-align: center;
  opacity: ${p => (p.isActive ? "1" : "0.5")};
`

const Group = styled.div`
  display: flex;
`

const CloudTagMemo = ({ Folders, setCustomFolder, openFolder, deleteFolder, rescanFolder }) => {
  const [open, setOpen] = useState(true)

  const handleHideShowClick = ID => {
    let newArray = []
    if (Folders.FoldersActive.includes(ID)) {
      newArray = Folders.FoldersActive.filter(folder => folder !== ID)
    } else {
      newArray = [...Folders.FoldersActive, ID]
    }
    setCustomFolder(newArray, Folders)
  }

  const isActive = ID => Folders.FoldersActive.includes(ID)

  return (
    <Module>
      <MenuLabel open={open} center bold onClick={() => setOpen(!open)}>
        Filter by Folder
      </MenuLabel>
      <CloudFlex open={open} noFlex>
        <Flex>
          {Folders?.FolderArray?.map((item, idx) => (
            <PathDiv key={idx} isActive={isActive(item.folderID)}>
              <NameDiv>
                <PureName>{item.folderName}</PureName>
                <Group>
                  <Option hover="#173C90" onClick={() => handleHideShowClick(item.folderID)}>
                    {isActive(item.folderID) ? "HIDE" : "SHOW"}
                  </Option>
                  <Option hover="tomato" onClick={() => deleteFolder(item)}>
                    REMOVE
                  </Option>
                  <Option hover="#abe15455" onClick={() => rescanFolder(item.folderID)}>
                    RESCAN
                  </Option>
                </Group>
              </NameDiv>
            </PathDiv>
          ))}
        </Flex>
        <br />
        <TagTitle
          center
          maxWidth="120px"
          active={true}
          px={"14px"}
          padding={"4px 12px"}
          hasSamples
          bold
          onClick={() => openFolder()}
        >
          Add Folder +
        </TagTitle>
        <LoadingLabel />
      </CloudFlex>
    </Module>
  )
}

const FolderCloud = () => {
  const { Clouds, setCustomFolder, openFolder, deleteFolder, rescanFolder } =
    useContext(ToneContext)
  const CloudTagMemoProc = useMemo(
    () => (
      <CloudTagMemo
        Folders={Clouds.Folders}
        setCustomFolder={setCustomFolder}
        openFolder={openFolder}
        deleteFolder={deleteFolder}
        rescanFolder={rescanFolder}
      />
    ),
    [Clouds, setCustomFolder, openFolder, deleteFolder, rescanFolder]
  )

  return <>{CloudTagMemoProc}</>
}

export default FolderCloud
