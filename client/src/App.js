import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Home from './Pages/Home'
import About from './Pages/About'
import Contact from './Pages/Contact'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Pnf from './Pages/Pnf'
import Menu from './components/Menu'

const App = () => {
  return (
    <BrowserRouter>
      <Menu />
    <ToastContainer autoClose={4000} position={'top-right'}/>
    <Routes>
       <Route path={`/`} element={<Home />}/>
       <Route path={`/about`} element={<About />}/>
       <Route path={`/contact`} element={<Contact />}/>
       <Route path={`/login`} element={<Login />}/>
       <Route path={`/register`} element={<Register />}/>
       <Route path={`/*`} element={<Pnf />}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App