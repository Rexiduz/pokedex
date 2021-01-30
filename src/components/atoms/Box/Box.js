import styled from 'styled-components'
import { layout, space, color, position, flex } from 'styled-system'
import injectCss from 'utils/injectCss'

const Box = styled.div`
  ${space}
  ${color}
  ${layout}
  ${position}
  ${flex}
  ${injectCss}
`

export default Box
