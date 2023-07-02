import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Home } from '@pages/Home'
import { SchemaTest } from '@pages/TableTest'
import { Test } from '@pages/Test'

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
        <Route path="/schema-test" element={<SchemaTest />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  )
}
