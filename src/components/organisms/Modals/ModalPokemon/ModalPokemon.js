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
  const refInput = React.useRef()

  const { data, execute } = useAsync(API.cards.get, false, {
    onSuccess: (data, arg) => {
      savedParams.current = arg
      savedPending.current = false
      return data
    }
  })

  const hasMore = data?.hasNext && !pending && !savedPending.current

  const filterFromUserList = (list) =>
    list.filter((item) => !savedUserCardIDList.current.includes(item.id))

  React.useEffect(() => {
    if (visible) {
      savedPending.current = true

      execute(savedParams.current, {
        onSuccess(data) {
          setList(filterFromUserList(data?.cards))
        }
      })
    } else {
      savedParams.current = defaultParams
      refInput.current.value = ''
    }
  }, [execute, visible])

  React.useEffect(() => {
    savedUserCardIDList.current = userList.map((i) => i.id)
    setList(filterFromUserList)
  }, [userList])

  React.useEffect(() => {
    if (!pending) setItemAdded(null)
  }, [pending])

  const onAddCard = React.useCallback(
    (item) => {
      setItemAdded(item)
      onAdd(item)
    },
    [onAdd]
  )

  const loadMore = React.useCallback(() => {
    if (savedPending.current) return
    savedPending.current = true

    execute(
      {
        ...savedParams.current,
        page: Number(savedParams.current?.page) + 1
      },
      {
        onSuccess(data) {
          setList((prev) => filterFromUserList([...prev, ...data?.cards]))
        }
      }
    )
  }, [execute])

  const onInputChange = React.useCallback(
    (e) => {
      const value = e.target.value
      savedPending.current = true

      execute(
        {
          ...savedParams.current,
          page: 1,
          search: value
        },
        {
          onSuccess(data) {
            setList(filterFromUserList(data?.cards))
          }
        }
      )
    },
    [execute]
  )

  const memoInput = React.useMemo(
    () => (
      <Input
        ref={refInput}
        mb="1rem"
        placeholder={'Find pokemon'}
        suffix={
          <Box size="24px" inject="img {width:inherit;height:inherit;}">
            <img src={FindIcon} alt="search" loading="lazy" />
          </Box>
        }
        onChange={debounce(onInputChange, 500)}
      />
    ),
    [onInputChange]
  )

  const memoList = React.useMemo(() => {
    return (
      <List
        dataSource={list}
        renderItem={(item) => (
          <Spin tip="Adding..." spinning={itemAdded?.id === item.id && pending}>
            <PokemonCard
              {...item}
              {...(!pending && {
                onAdd: () => onAddCard(item)
              })}
            />
          </Spin>
        )}
      />
    )
  }, [itemAdded?.id, list, onAddCard, pending])

  const memoInfiniteScroll = React.useMemo(() => {
    return (
      <InfiniteScroll
        loadMore={() => loadMore()}
        hasMore={hasMore}
        useWindow={false}
      >
        {memoList}
      </InfiniteScroll>
    )
  }, [hasMore, loadMore, memoList])

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
      {memoInput}
      <Box style={{ height: '78vh', overflow: 'auto' }}>
        {memoInfiniteScroll}
      </Box>
    </Modal>
  )
}

export default ModalPokemon
