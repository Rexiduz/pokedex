import { combineProviders } from 'react-combine-providers'

import React from 'react'
import { ThemeProvider } from 'styled-components'
import { BrowserRouter as Router } from 'react-router-dom'

const providers = combineProviders()

providers.push(React.StrictMode)
providers.push(Router)
providers.push(ThemeProvider, { theme: require('configs/theme').default })

export default providers.master()
