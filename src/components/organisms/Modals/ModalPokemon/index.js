import React from 'react'
import { useAsync } from 'core/hooks'
import { API } from 'services'

import { Modal, List } from 'antd'
import InfiniteScroll from 'react-infinite-scroller'

import { LIMIT } from 'constants/setting'

const ModalPokemon = ({ visible, ...props }) => {
  const [list, setList] = React.useState([])
  const savedParams = React.useRef({
    page: 1,
    limit: LIMIT
  })

  const { data, pending, execute } = useAsync(API.cards.get, false, {
    onSuccess: (data, arg) => {
      savedParams.current = arg
      setList((prev) => [...prev, ...data?.cards])
      return data
    }
  })

  React.useEffect(() => {
    execute(savedParams.current)
  }, [execute])

  const loadMore = () => {
    execute({
      ...savedParams.current,
      page: Number(savedParams.current?.page) + 1
    })
  }

  return (
    <Modal
      visible={visible}
      {...props}
      footer={null}
      closable={false}
      bodyStyle={{ height: '80vh', overflow: 'auto' }}
    >
      <InfiniteScroll
        loadMore={() => loadMore()}
        hasMore={!pending && data?.hasNext}
        useWindow={false}
      >
        <List
          loading={pending}
          dataSource={list}
          renderItem={(item) => {
            return <div>{JSON.stringify(item, null, 2)}</div>
          }}
        />
      </InfiniteScroll>
    </Modal>
  )
}

export default ModalPokemon
