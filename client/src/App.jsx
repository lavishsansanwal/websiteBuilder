import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Home from './pages/Home'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useSelector } from 'react-redux'
import Dashboard from './pages/Dashboard'
import Generate from './pages/Generate'
import WebsiteEditor from './pages/Editor'
import LiveSite from './pages/LiveSite'
import Pricing from './pages/Pricing'
import Workbench from './pages/Workbench'
import Upload from "./pages/Upload"

export const serverUrl = "http://localhost:8000"

function App() {
    useGetCurrentUser()

    const { userData } = useSelector(state => state.user)

    return (
        <BrowserRouter>
            <Routes>

                {/* Home */}
                <Route
                    path='/'
                    element={<Home />}
                />

                {/* Login */}
                {
                    userData &&
                    <Route
                        path='/login'
                        element={<Navigate to="/dashboard" />}
                    />
                }

                {/* Dashboard */}
                <Route
                    path='/dashboard'
                    element={userData ? <Dashboard /> : <Home />}
                />

                {/* AI Website Generation */}
                <Route
                    path='/generate'
                    element={userData ? <Generate /> : <Home />}
                />

                {/* CSV / JSON Upload */}
                <Route
                    path='/upload'
                    element={userData ? <Upload /> : <Home />}
                />

                {/* Website Editor */}
                <Route
                    path='/editor/:id'
                    element={userData ? <WebsiteEditor /> : <Home />}
                />

                {/* Workbench */}
                <Route
                    path='/workbench'
                    element={userData ? <Workbench /> : <Home />}
                />

                {/* Live Website */}
                <Route
                    path='/site/:id'
                    element={<LiveSite />}
                />

                {/* Pricing */}
                <Route
                    path='/pricing'
                    element={<Pricing />}
                />

                {/* Invalid URL */}
                <Route
                    path='*'
                    element={<Navigate to="/" />}
                />

            </Routes>
        </BrowserRouter>
    )
}

export default App
