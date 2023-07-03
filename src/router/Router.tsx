import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { Home } from '@pages/Home'

// import { Graph } from '@/pages/Graph'

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/graph/:database" element={<Graph />} /> */}
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  )
}
