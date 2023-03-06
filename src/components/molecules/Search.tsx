import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import ClickAwayListener from '@mui/base/ClickAwayListener'
import { FixedSizeList as List } from 'react-window'
import AutoSizer, { Size } from 'react-virtualized-auto-sizer'
import Fuse from 'fuse.js'

import Item from '../atoms/Item'
import CustomTextField from '../atoms/TextField'

import data from '../../datas/datas.json'

type Items = {
  activity: string
  sector: string
  category: string
}

type SearchProps = {
  keys: string[]
}

type Row = {
  index: number
  style: React.CSSProperties
}

const highlight = (
  fuseSearchResult: Fuse.FuseResult<Items>[],
  highlightClassName: string = 'highlight'
) => {
  const set = (obj: any, path: string, value: string) => {
    const pathValue = path.split('.')
    let i

    for (i = 0; i < pathValue.length - 1; i++) {
      obj = obj[pathValue[i]]
    }

    obj[pathValue[i]] = value
  }

  const generateHighlightedText = (inputText: string, regions = []) => {
    let content = ''
    let nextUnhighlightedRegionStartingIndex = 0

    regions.forEach((region) => {
      const lastRegionNextIndex = region[1] + 1

      content += [
        inputText.substring(nextUnhighlightedRegionStartingIndex, region[0]),
        `<mark class="${highlightClassName}">`,
        inputText.substring(region[0], lastRegionNextIndex),
        '</mark>',
      ].join('')

      nextUnhighlightedRegionStartingIndex = lastRegionNextIndex
    })

    content += inputText.substring(nextUnhighlightedRegionStartingIndex)

    return content
  }

  return fuseSearchResult
    .filter(({ matches }: Fuse.FuseResult<Items>) => matches && matches.length)
    .map(({ item, matches }: Fuse.FuseResult<Items>) => {
      const highlightedItem = { ...item }

      matches?.forEach((match: any) => {
        set(
          highlightedItem,
          match.key,
          generateHighlightedText(match.value, match.indices)
        )
      })

      return highlightedItem
    })
}

let fuse: Fuse<any>
const Search = (props: SearchProps) => {
  const [value, setValue] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [searchData, setSearchData] = useState<Items[]>(data)
  const [searchDataHighlight, setSearchDataHighlight] = useState<Items[]>(data)

  useEffect(() => {
    fuse = new Fuse(data, {
      includeMatches: true,
      shouldSort: true,
      threshold: 0.1,
      location: 0,
      distance: 100,
      useExtendedSearch: true,
      keys: props.keys,
    })
  }, [])

  const searchItem = (query: string) => {
    setIsOpen(query.length === 0 || query.length < 2 ? false : true)
    const result: Fuse.FuseResult<Items>[] = fuse.search(`${query}`) // "'" +
    const finalResult: Items[] = []
    if (result.length) {
      result.forEach(({ item }) => {
        finalResult.push(item)
      })
      setSearchData(finalResult)
      setSearchDataHighlight(highlight(result))
    } else {
      setSearchData(data)
      setSearchData(data)
    }
    setValue(query)
  }

  const Row = ({ index, style }: Row) => (
    <ListItem
      onClick={() => {
        setValue(searchData[index]?.activity)
        setIsOpen(false)
      }}
      style={style}
    >
      <Item {...searchDataHighlight[index]} key={index} />
    </ListItem>
  )

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <SearchContainer>
        <CustomTextField
          name={'time'}
          type={'search'}
          className="time"
          label={'Search activity'}
          value={value}
          changeHandler={(e) => searchItem(e.target.value)}
        />
        {isOpen && (
          <ItemContainer>
            <DivAutoSizer>
              <AutoSizer>
                {({ height, width }: Size) => (
                  <List
                    className="List"
                    height={height}
                    itemCount={searchDataHighlight.length}
                    itemSize={85}
                    width={width}
                  >
                    {Row}
                  </List>
                )}
              </AutoSizer>
            </DivAutoSizer>
          </ItemContainer>
        )}
      </SearchContainer>
    </ClickAwayListener>
  )
}

export default Search

const SearchContainer = styled.div`
  position: relative;
`
const ItemContainer = styled.div`
  position: absolute;
  z-index: 10;
  top: 40px;
  border-left: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  width: 100%;
  height: 350px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  max-height: 350px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  .item {
    width: 100%;
  }
  .item .logo {
    width: 12%;
    float: left;
  }
  .item .name {
    width: 88%;
    float: left;
  }
  .item .name p {
    margin-top: 2px;
  }
`
const DivAutoSizer = styled.div`
  flex: 1 1 auto;
  height: 350px;
`
const ListItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  :nth-child(odd) {
    background-color: #f5f5f5;
  }
  :nth-child(even) {
    background-color: #fff;
  }
  .sub {
    color: #686980;
    font-size: 12px;
  }
  :hover {
    background-color: #c1c1c1;
    color: #fff;
    .sub {
      color: #fff;
    }
  }
`
