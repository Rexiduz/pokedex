import React from 'react'
import { API } from 'services'
import { useAsync } from 'core/hooks'
import { Row, Col } from 'antd'
import { Text, Box } from 'components/atoms'
import { PokemonCard as BasePokemonCard } from 'components/molecules/Cards'
import { ModalPokemon } from 'components/organisms/Modals'
import Layout from 'components/templates/Layout'

import styled from 'styled-components'

const PokemonCard = styled(BasePokemonCard)``

const Home = () => {
  const [list, setList] = React.useState([])
  const [open, setOpen] = React.useState(!false)
  // const { execute: } = useAsync(API.users.get)
  const { execute: updateList } = useAsync(API.users.get)

  const openModal = () => setOpen(true)
  const closeModal = () => setOpen(false)

  const onAddCard = (item) => {
    setList((prev) => [...prev, item])
  }

  const onDelete = (item) => {
    setList((prev) => prev.filter((i) => i.id !== item.id))
  }

  return (
    <Layout onAdd={() => openModal()}>
      <Text as="h1" textAlign="center" fontSize="1.75rem" pt="1rem">
        My Pokedex
      </Text>
      <Box style={{ height: 'calc(100% - 74px)', overflow: 'auto' }}>
        <Row style={{ marginBottom: 40 }}>
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
      </Box>
      <ModalPokemon
        userList={list}
        visible={open}
        onCancel={closeModal}
        onAddCard={onAddCard}
      />
    </Layout>
  )
}

export default Home
