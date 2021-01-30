import React from 'react'
import { API } from 'services'
import { useAsync } from 'core/hooks'

import InfiniteScroll from 'react-infinite-scroller'
import { Spin, List } from 'antd'
import { Text, Box } from 'components/atoms'
import { PokemonCard } from 'components/molecules/Cards'
import { ModalPokemon } from 'components/organisms/Modals'
import Layout from 'components/templates/Layout'

import { LIMIT, USER_ID } from 'constants/setting'

const defaultParams = {
  page: 1,
  limit: LIMIT
}

const Home = () => {
  const [list, setList] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const { data, execute: getList, pending: fetching } = useAsync(
    API.users.cards.get,
    false,
    {
      onSuccess: (data, arg) => {
        savedParams.current = arg
        savedPending.current = false
        return data
      }
    }
  )
  const { execute: updateItem, pending: updating } = useAsync(
    API.users.cards.update
  )
  const { execute: deleteItem, pending: deleting } = useAsync(
    API.users.cards.delete
  )

  const savedPending = React.useRef(false)
  const savedParams = React.useRef(defaultParams)

  const pending = fetching || updating || deleting
  const hasMore = data?.hasNext && !pending && !savedPending.current

  const fetchList = React.useCallback(
    (
      params,
      callback = {
        onSuccess(data) {
          setList(data.cards)
        }
      }
    ) =>
      getList(
        {
          page: 1,
          limit: LIMIT,
          ...savedParams.current,
          ...params,
          id: USER_ID
        },
        callback
      ),
    [getList]
  )

  React.useEffect(() => {
    fetchList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openModal = () => setOpen(true)
  const closeModal = () => setOpen(false)

  const onAddCard = React.useCallback(
    (item) => {
      updateItem(
        {
          id: USER_ID,
          data: item
        },
        {
          onSuccess: ({ total }) => {
            fetchList({
              page: 1,
              limit: total
            })
          }
        }
      )
    },
    [fetchList, updateItem]
  )

  const onDelete = React.useCallback(
    (item) => {
      deleteItem(
        {
          id: USER_ID,
          cardID: item.id
        },
        {
          onSuccess: () => {
            fetchList({
              page: 1,
              limit: list.length
            })
          }
        }
      )
    },
    [list, deleteItem, fetchList]
  )

  const loadMore = React.useCallback(() => {
    if (savedPending.current) return
    savedPending.current = true

    fetchList(
      {
        page: Number(savedParams.current.page) + 1,
        limit: savedParams.current.limit
      },
      {
        onSuccess(data) {
          setList((prev) => [...prev, ...data.cards])
        }
      }
    )
  }, [fetchList])

  const memoList = React.useMemo(() => {
    return (
      <Spin tip="Loading..." spinning={pending}>
        <InfiniteScroll
          loadMore={() => loadMore()}
          hasMore={hasMore}
          useWindow={false}
        >
          <List
            grid={{ column: 2 }}
            dataSource={list}
            renderItem={(item, index) => {
              return (
                <PokemonCard
                  {...item}
                  style={{
                    margin: !(index % 2)
                      ? '10px 10px 10px 20px'
                      : '10px 20px 10px 10px'
                  }}
                  barSpan={8}
                  onDelete={() => onDelete(item)}
                />
              )
            }}
          />
        </InfiniteScroll>
      </Spin>
    )
  }, [hasMore, list, loadMore, onDelete, pending])

  const memoModal = React.useMemo(() => {
    return (
      <ModalPokemon
        userList={list}
        visible={open}
        pending={pending}
        onCancel={closeModal}
        onAddCard={onAddCard}
      />
    )
  }, [list, onAddCard, open, pending])

  return (
    <Layout onAdd={() => openModal()}>
      <Text as="h1" textAlign="center" fontSize="1.75rem" pt="1rem">
        My Pokedex
      </Text>
      <Box
        style={{ height: 'calc(100% - 74px)', overflow: 'auto' }}
        onScroll={console.log}
      >
        {memoList}
      </Box>
      {memoModal}
    </Layout>
  )
}

export default Home
