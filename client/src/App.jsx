import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Ngo from './pages/Ngo'
import Volunteer from './pages/Volunteer'

const routes = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/ngo',
    element: <Ngo />
  },
  {
    path: 'volunteer',
    element: <Volunteer />
  },
])

function App() {
  return (
    <div className="app">
      <RouterProvider router={routes} />
    </div>
  )
}

export default App