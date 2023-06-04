import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { CreateQuest } from '@pages/CreateQuest'
import { Home } from '@pages/Home'

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-quest" element={<CreateQuest />} />
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  )
}
