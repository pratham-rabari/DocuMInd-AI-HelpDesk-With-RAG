
import './App.css'
import Admin from './components/Admin/Admin'
import HomePage from './HomePage'

function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'

  return (
    path === '/admin' ? <Admin /> : <HomePage />
  )
}

export default App
