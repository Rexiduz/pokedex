import styled from 'styled-components'
import { layout, space, color } from 'styled-system'
import injectCss from 'utils/injectCss'

const Box = styled.div`
  ${space}
  ${color}
  ${layout}
  ${injectCss}
`

export default Box
