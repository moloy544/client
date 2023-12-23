'use client'
import { Provider } from "react-redux"
import { store } from "./store"

function ReduxStatePrivider({ children }) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export default ReduxStatePrivider
