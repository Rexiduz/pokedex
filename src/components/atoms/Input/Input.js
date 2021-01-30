import { Input as AntInput } from 'antd'
import styled, { css } from 'styled-components'
import { space, typography } from 'styled-system'
import Color from 'color'

const Input = styled(AntInput)`
  font-family: Gaegu;
  .ant-input {
    font-size: 1.5rem;
  }
  ${typography};
  ${space}
  ${({ theme }) => css`
    &.ant-input-affix-wrapper:hover,
    &.ant-input-affix-wrapper:focus,
    &.ant-input-affix-wrapper-focused {
      border-color: ${theme?.colors?.colorAddButton};
      box-shadow: 0 0 0 2px
        ${Color(theme?.colors?.colorAddButton).lighten(0.12)};
    }
  `}
`

export default Input
