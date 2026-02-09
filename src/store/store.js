import {configureStore} from '@reduxjs/toolkit'
import authReducer from './authSlice'

// add more slice here for posts

const store = configureStore({
    reducer: {
        auth: authReducer
    }
})

export default store;