import { gql } from '@apollo/client'

export const ACTIVITY_QUERIES = gql`
  {
    getActivities {
      id
      name
      category {
        name
      }
      sector {
        name
      }
    }
  }
`
