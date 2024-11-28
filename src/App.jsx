
import Login from './pages/Login'
import Signup from './pages/Signup'
import Tasks from './pages/Tasks'
import Dashboard from './pages/DashBoard'
import { Routes, Route } from 'react-router'
import RequireAuth from './components/Auth/RequireAuth'

function App() {
  return(
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path='/signup' element={<Signup />}/>
      <Route element={<RequireAuth />}>
       <Route path='/dashboard' element={<Dashboard />}/>
       <Route path='/tasks' element={<Tasks />}/>
      </Route>
    </Routes>
  )
}

export default App
