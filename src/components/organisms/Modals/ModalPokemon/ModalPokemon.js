import React from 'react'
import { useAsync } from 'core/hooks'
import { API } from 'services'

import InfiniteScroll from 'react-infinite-scroller'
import { Modal, List } from 'antd'
import { Box, Input } from 'components/atoms'
import { PokemonCard } from 'components/molecules/Cards'

import FindIcon from 'assets/image/search.png'
import { LIMIT } from 'constants/setting'
import debounce from 'lodash/debounce'
import noop from 'lodash/noop'

const defaultParams = {
  page: 1,
  limit: LIMIT
}

const ModalPokemon = ({ visible, onAddCard = noop, userList, ...props }) => {
  const [list, setList] = React.useState([])

  const savedParams = React.useRef(defaultParams)
  const savedUserCardIDList = React.useRef(userList)

  const { data, pending, execute } = useAsync(API.cards.get, false, {
    onSuccess: (data, arg) => {
      savedParams.current = arg
      return data
    }
  })

  React.useEffect(() => {
    if (visible)
      execute(savedParams.current, {
        onSuccess(data) {
          const set = savedUserCardIDList.current
          const list = data?.cards

          const filtered = list.filter((item) => !set.includes(item.id))
          setList(filtered)
        }
      })
    else savedParams.current = defaultParams
  }, [execute, visible])

  React.useEffect(() => {
    const set = userList.map((i) => i.id)
    savedUserCardIDList.current = set

    setList((prev) => {
      return prev.filter((item) => !set.includes(item.id))
    })
  }, [userList])

  const loadMore = () => {
    execute(
      {
        ...savedParams.current,
        page: Number(savedParams.current?.page) + 1
      },
      {
        onSuccess(data) {
          setList((prev) => [...prev, ...data?.cards])
        }
      }
    )
  }

  const onInputChange = (e) => {
    const value = e.target.value
    execute(
      {
        ...savedParams.current,
        page: 1,
        search: value
      },
      {
        onSuccess(data) {
          setList(data?.cards)
        }
      }
    )
  }

  return (
    <Modal
      visible={visible}
      {...props}
      footer={null}
      closable={false}
      style={{ top: '5vh' }}
      width="90vw"
      bodyStyle={{
        paddingBottom: '8px'
      }}
    >
      <Input
        mb="1rem"
        placeholder={'Find pokemon'}
        suffix={
          <Box size="24px" inject="img {width:inherit;height:inherit;}">
            <img src={FindIcon} alt="search" loading="lazy" />
          </Box>
        }
        onChange={debounce(onInputChange, 500)}
      />

      <Box style={{ height: '78vh', overflow: 'auto' }}>
        <InfiniteScroll
          loadMore={() => loadMore()}
          hasMore={!pending && data?.hasNext}
          useWindow={false}
        >
          <List
            loading={pending}
            dataSource={list}
            renderItem={(item) => (
              <PokemonCard {...item} onAdd={() => onAddCard(item)} />
            )}
          />
        </InfiniteScroll>
      </Box>
    </Modal>
  )
}

export default ModalPokemon
