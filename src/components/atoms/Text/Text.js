import styled from 'styled-components'
import { typography, space, position } from 'styled-system'
import injectCss from 'utils/injectCss'

const Text = styled.div`
  ${typography}
  ${space}
  ${position}
  ${injectCss}
  font-family: ${({ $title }) => ($title ? 'Gaegu' : 'Atma')}, cursive;
  color: ${({ color, theme }) => theme['colors'][color] || color};
`

export default Text
