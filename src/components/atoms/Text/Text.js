import { Tooltip } from 'antd'
import styled from 'styled-components'
import { typography, space, position } from 'styled-system'
import injectCss from 'utils/injectCss'

const BaseText = styled.div`
  font-family: ${({ $title }) => ($title ? 'Gaegu' : 'Atma')}, cursive;
  color: ${({ color, theme }) => theme['colors'][color] || color};
  ${typography}
  ${space}
  ${position}
  ${injectCss}
`

const Text = ({ children, tooltip, ttpProps, ...props }) => {
  if (tooltip)
    return (
      <Tooltip title={children} {...ttpProps}>
        <BaseText {...props}>{children}</BaseText>
      </Tooltip>
    )

  return <BaseText {...props}>{children}</BaseText>
}

export default Text
