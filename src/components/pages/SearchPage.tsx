import { FC, ReactElement, useEffect } from 'react'
import BlockBox from '../organisms/Box'
import Search from '../molecules/Search'
import MySearch from '../molecules/SearchV2'
import { useQuery } from '@apollo/client'
import { ACTIVITY_QUERIES } from '../../dto/activity.dto'
import ProgressLinear from '../atoms/ProgressLinear'

type Sector = {
  name: string
}

type Category = {
  name: string
}

type Activity = {
  name: string
  category: Sector
  sector: Category
}

type GetActivities = {
  getActivities: Activity[]
}

const formatData = (data: GetActivities) => {
  return data.getActivities.map((item: any) => {
    return {
      activity: item.name,
      category: item.category.name,
      sector: item.sector.name,
    }
  })
}

const SearchPage: FC = (): ReactElement => {
  const { data, loading, error } = useQuery(ACTIVITY_QUERIES)

  if (!data) return <ProgressLinear isLoading={loading} />

  return (
    <BlockBox>
      <h2>First test</h2>
      <Search keys={['activity', 'category', 'sector']} />
      {!data ? (
        <ProgressLinear isLoading={loading} />
      ) : (
        <>
          <h2>Second test with hook</h2>
          <MySearch
            keys={['activity', 'category', 'sector']}
            data={formatData(data)}
          />
        </>
      )}
    </BlockBox>
  )
}

export default SearchPage
