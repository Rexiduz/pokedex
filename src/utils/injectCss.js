const injectCss = ({ inject, ...props }) => {
  let cssString

  if (typeof inject === 'function') {
    cssString = inject(props)
  } else {
    cssString = inject
  }

  return cssString
}

export default injectCss
