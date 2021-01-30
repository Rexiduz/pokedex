import React from 'react'
import { useAsync } from 'core/hooks'
import { API } from 'services'

import InfiniteScroll from 'react-infinite-scroller'
import { Modal as AntModal, List, Spin } from 'antd'
import { Box, Input } from 'components/atoms'
import { PokemonCard } from 'components/molecules/Cards'

import FindIcon from 'assets/image/search.png'
import { LIMIT } from 'constants/setting'
import debounce from 'lodash/debounce'
import noop from 'lodash/noop'
import styled from 'styled-components'

const Modal = styled(AntModal)`
  & {
    width: 90vw !important;
    max-width: 800px;
  }
`

const defaultParams = {
  page: 1,
  limit: LIMIT
}

const ModalPokemon = ({
  visible,
  onAddCard: onAdd = noop,
  userList,
  pending,
  ...props
}) => {
  const [list, setList] = React.useState([])
  const [itemAdded, setItemAdded] = React.useState(null)

  const savedParams = React.useRef(defaultParams)
  const savedUserCardIDList = React.useRef(userList)
  const savedPending = React.useRef(false)

  const { data, execute } = useAsync(API.cards.get, false, {
    onSuccess: (data, arg) => {
      savedParams.current = arg
      savedPending.current = false
      return data
    }
  })

  const hasMore = data?.hasNext && !pending && !savedPending.current

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

  React.useEffect(() => {
    if (!pending) setItemAdded(null)
  }, [pending])

  const onAddCard = (item) => {
    setItemAdded(item)
    onAdd(item)
  }

  const loadMore = () => {
    if (savedPending.current) return

    savedPending.current = true
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
          hasMore={hasMore}
          useWindow={false}
        >
          <List
            dataSource={list}
            renderItem={(item) => (
              <Spin
                tip="Adding..."
                spinning={itemAdded?.id === item.id && pending}
              >
                <PokemonCard
                  {...item}
                  {...(!pending && {
                    onAdd: () => onAddCard(item)
                  })}
                />
              </Spin>
            )}
          />
        </InfiniteScroll>
      </Box>
    </Modal>
  )
}

export default ModalPokemon
