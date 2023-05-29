import React from 'react'
import ReactDOM from 'react-dom/client'

import { Buffer } from 'buffer'
import { Stream } from 'stream'

import App from './App.tsx'

globalThis.Buffer = Buffer
// @ts-expect-error - globalThis.stream is a valid property
globalThis.stream = Stream

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />)
