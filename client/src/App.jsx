import React from "react";
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import Home from "./pages/Home";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { useSelector } from "react-redux";

import Dashboard from "./pages/Dashboard";
import Generate from "./pages/Generate";
import WebsiteEditor from "./pages/Editor";
import LiveSite from "./pages/LiveSite";
import Pricing from "./pages/Pricing";
import Workbench from "./pages/Workbench";
import Upload from "./pages/Upload";
import axios from "axios";

export const serverUrl = "http://localhost:8000";

// Global axios interceptor to attach authentication credentials automatically
axios.interceptors.request.use((config) => {
    config.withCredentials = true;
    try {
        const storedUser = localStorage.getItem("genweb_user") || localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            if (parsed._id) {
                config.headers["x-user-id"] = parsed._id;
            }
            if (parsed.token) {
                config.headers["Authorization"] = `Bearer ${parsed.token}`;
            }
        }
        const token = localStorage.getItem("genweb_token") || localStorage.getItem("token");
        if (token && !config.headers["Authorization"]) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
    } catch (e) {}
    return config;
}, (error) => Promise.reject(error));

function App() {
    useGetCurrentUser();

    const { userData } = useSelector(
        (state) => state.user
    );

    return (
        <BrowserRouter>
            <Routes>

                {/* HOME */}
                <Route
                    path="/"
                    element={<Home />}
                />

                {/* LOGIN REDIRECT */}
                <Route
                    path="/login"
                    element={
                        userData
                            ? <Navigate to="/dashboard" replace />
                            : <Home />
                    }
                />

                {/* DASHBOARD */}
                <Route
                    path="/dashboard"
                    element={
                        userData
                            ? <Dashboard />
                            : <Home />
                    }
                />

                {/* GENERATE WEBSITE */}
                <Route
                    path="/generate"
                    element={
                        userData
                            ? <Generate />
                            : <Home />
                    }
                />

                {/* UPLOAD CSV / JSON */}
                <Route
                    path="/upload"
                    element={
                        userData
                            ? <Upload />
                            : <Home />
                    }
                />

                {/* WEBSITE EDITOR */}
                <Route
                    path="/editor/:id"
                    element={
                        userData
                            ? <WebsiteEditor />
                            : <Home />
                    }
                />

                {/* WORKBENCH */}
                <Route
                    path="/workbench"
                    element={
                        userData
                            ? <Workbench />
                            : <Home />
                    }
                />

                {/* LIVE WEBSITE */}
                <Route
                    path="/site/:id"
                    element={<LiveSite />}
                />

                {/* PRICING */}
                <Route
                    path="/pricing"
                    element={<Pricing />}
                />

                {/* INVALID ROUTES */}
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;