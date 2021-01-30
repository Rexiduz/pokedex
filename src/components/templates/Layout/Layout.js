import { Layout as AntLayout } from 'antd'
import { Box } from 'components/atoms'
import { PlusOutlined } from '@ant-design/icons'

import styled, { css } from 'styled-components'
import Color from 'color'

const Content = styled(AntLayout.Content)``
const Container = styled.div`
  max-width: 1024px;
  margin: auto;
  height: calc(100vh - 64px);
`

const Footer = styled(AntLayout.Footer)`
  background: ${({ theme }) => theme.colors.bottomBarBackground};
  height: 64px;
`

const circleBoxCss = ({ theme }) => {
  const darken = Color(theme.colors.bottomBarBackground).darken(0.12)
  return css`
    transition: all 0.2s;
    :hover,
    :focus {
      bottom: 2px;
      background: ${darken};
    }
    :active {
      bottom: -2px;
    }
  `
}

const Layout = ({ children, onAdd, ...props }) => {
  return (
    <AntLayout className="fullscreen">
      <Content>
        <Container>{children}</Container>
      </Content>
      <Footer className="relative">
        <Box
          className="user-select-none circle absolute-center center cursor-pointer"
          size="100px"
          bg="inherit"
          inject={circleBoxCss}
          onClick={onAdd}
        >
          <PlusOutlined style={{ fontSize: 36, color: 'white' }} />
        </Box>
      </Footer>
    </AntLayout>
  )
}
export default Layout
