import styled from '@emotion/styled'

type ItemProps = {
  activity: string
  sector: string
  category: string
}

const Item = (props: ItemProps) => {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: props?.activity }} />
      <div
        className="sub"
        dangerouslySetInnerHTML={{ __html: props?.sector }}
      />
      <div
        className="sub"
        dangerouslySetInnerHTML={{ __html: props?.category }}
      />
    </div>
  )
}

export default Item

const Div = styled.div`
  .highlight {
    color: #3858c0;
  }
`
const Tag = styled.div`
  color: #686980;
  font-size: 12px;
  .highlight {
    color: #3858c0;
  }
`
