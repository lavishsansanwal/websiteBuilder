import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function useGetCurrentUser() {
    const dispatch = useDispatch()

    useEffect(() => {
        // 1. Instantly check localStorage on initial render for zero delay
        try {
            const stored = localStorage.getItem("genweb_user") || localStorage.getItem("user");
            if (stored) {
                dispatch(setUserData(JSON.parse(stored)));
            }
        } catch (e) {
            console.error("Failed to parse user from localStorage:", e);
        }

        // 2. Background sync with backend for fresh credits/profile data
        const syncCurrentUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/me`, { withCredentials: true })
                if (result.data) {
                    dispatch(setUserData(result.data))
                }
            } catch (error) {
                // If the server explicitly returns 401 (unauthorized), clear local session
                if (error.response && error.response.status === 401) {
                    dispatch(setUserData(null))
                }
            }
        }

        syncCurrentUser()
    }, [dispatch])
}

export default useGetCurrentUser
