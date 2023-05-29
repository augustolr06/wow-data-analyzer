import React from 'react'

import { ThemeProvider } from '@nexds/web'
import { Router } from '@router/Router'

import { GlobalStyle } from './global.styles'

function App() {
  return (
    <ThemeProvider theme="dark">
      <GlobalStyle />
      <Router />
    </ThemeProvider>
  )
}

export default App
