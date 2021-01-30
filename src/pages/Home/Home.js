import React from 'react'
import { API } from 'services'
import { useAsync } from 'core/hooks'

import { Row, Col, Spin } from 'antd'
import { Text, Box } from 'components/atoms'
import { PokemonCard } from 'components/molecules/Cards'
import { ModalPokemon } from 'components/organisms/Modals'
import Layout from 'components/templates/Layout'

import { LIMIT, USER_ID } from 'constants/setting'

const Home = () => {
  const [list, setList] = React.useState([])
  const [open, setOpen] = React.useState(false)
  const { execute: getList, pending: fetching } = useAsync(API.users.cards.get)
  const { execute: updateItem, pending: updating } = useAsync(
    API.users.cards.update
  )
  const { execute: deleteItem, pending: deleting } = useAsync(
    API.users.cards.delete
  )

  const pending = fetching || updating || deleting

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
          ...params,
          id: USER_ID,
          limit: LIMIT
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

  const onAddCard = (item) => {
    updateItem(
      {
        id: USER_ID,
        data: item
      },
      {
        onSuccess: () => {
          fetchList()
        }
      }
    )
  }

  const onDelete = (item) => {
    deleteItem(
      {
        id: USER_ID,
        cardID: item.id
      },
      {
        onSuccess: () => {
          fetchList()
        }
      }
    )
  }

  return (
    <Layout onAdd={() => openModal()}>
      <Text as="h1" textAlign="center" fontSize="1.75rem" pt="1rem">
        My Pokedex
      </Text>
      <Box style={{ height: 'calc(100% - 74px)', overflow: 'auto' }}>
        <Spin tip="Loading..." spinning={pending}>
          <Row style={{ margin: '20px 0 40px' }}>
            {list.map((item, index) => {
              return (
                <Col
                  span={12}
                  key={item.id}
                  style={{
                    padding: !(index % 2) ? '0 10px 0 20px' : '0 20px 0 10px'
                  }}
                >
                  <PokemonCard
                    {...item}
                    barSpan={8}
                    onDelete={() => onDelete(item)}
                  />
                </Col>
              )
            })}
          </Row>
        </Spin>
      </Box>
      <ModalPokemon
        userList={list}
        visible={open}
        pending={pending}
        onCancel={closeModal}
        onAddCard={onAddCard}
      />
    </Layout>
  )
}

export default Home
