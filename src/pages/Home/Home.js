import React from 'react'
// import { API } from 'services'
// import { useAsync } from 'core/hooks'
import Text from 'components/atoms/Text'
import ModalPokemon from 'components/organisms/Modals/ModalPokemon'
import Layout from 'components/templates/Layout'

const Home = () => {
  const [open, setOpen] = React.useState(false)
  // const { data } = useAsync(API.users.get)

  const openModal = () => setOpen(true)
  const closeModal = () => setOpen(false)

  return (
    <Layout onAdd={() => openModal()}>
      <Text as="h1" textAlign="center" fontSize="1.75rem" mt="1rem">
        My Pokedex
      </Text>
      {/* 
      <ul>
        {data?.cards?.map((card) => {
          return (
            <li
              key={card.id}
              style={{
                border: '1px solid #888',
                borderRadius: '2px',
                margin: '5px'
              }}
            >
              <code>{JSON.stringify(card, null, 2)}</code>
            </li>
          )
        })}
      </ul>
         */}
      <ModalPokemon visible={open} onCancel={closeModal} />
    </Layout>
  )
}

export default Home
