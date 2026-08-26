import { createSlice } from "@reduxjs/toolkit";

const getInitialUser = () => {
    try {
        const stored = localStorage.getItem("genweb_user") || localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    } catch (e) {
        console.error("Error reading user from localStorage:", e);
        return null;
    }
};

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: getInitialUser()
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
            if (action.payload) {
                try {
                    const serialized = JSON.stringify(action.payload);
                    localStorage.setItem("genweb_user", serialized);
                    localStorage.setItem("user", serialized);
                } catch (e) {
                    console.error("Error writing user to localStorage:", e);
                }
            } else {
                localStorage.removeItem("genweb_user");
                localStorage.removeItem("user");
                localStorage.removeItem("userData");
            }
        },
        logoutUser: (state) => {
            state.userData = null;
            localStorage.removeItem("genweb_user");
            localStorage.removeItem("user");
            localStorage.removeItem("userData");
        }
    }
});

export const { setUserData, logoutUser } = userSlice.actions;
export default userSlice.reducer;