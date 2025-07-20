import {Navigate} from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import api from "../api"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import {useState, useEffect, type ReactNode} from "react"

// This code handles on initial page load, validiates the token, refreshes if needed before showing route

interface ProtectedRouteProps {
    children: ReactNode
}

interface DecodedToken {
    exp: number
    [key: string]: any
}

function ProtectedRoute({ children } : ProtectedRouteProps) {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

    // Checks if user has a valid token
    useEffect(() => {
      auth().catch(() => setIsAuthorized(false))
    }, [])
    
    // Gets new access token using refresh token
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN) // gets refesh token from local storage

        // If user does not have refresh token dont even bother sending call to api
        if (!refreshToken) {
            setIsAuthorized(false)
            return
        }

        try {
            const res = await api.post("/api/token/refresh/", {refresh: refreshToken}); // makes a request for acccess token sending in refresh token

            // If status is OK then access token is set and user is allowed access
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true) 

            // Denies user access
            } else {
                setIsAuthorized(false)
            }

        // Catches POST requests error
        } catch (error) {
            console.log(error)
            setIsAuthorized(false)
        }

    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)

        // Checks if user has access token
        if (!token) {
            setIsAuthorized(false)
            return
        }

        // Trys to decode token
        let decoded: DecodedToken
        try {
            decoded = jwtDecode<DecodedToken>(token)
        } catch (error) {
            console.error("Failed to decode token:", error)
            setIsAuthorized(false)
            return
        }

        const tokenExpiration = decoded.exp // Gets tokens expiration
        const now = Date.now() / 1000 // Gets date by seconds

        // If expired attempts to refresh token
        if (tokenExpiration < now){
            await refreshToken()
        // If not expired user is authorized
        } else {
            setIsAuthorized(true)
        }

    }

    // Rendering logic if user is not authorized
    if (isAuthorized === null) {
        return <div>Loading...</div>
    }

    // If authorized renders "children" page (the route that was attempting to be accessed) if not redirect to login
    return isAuthorized ? children : <Navigate to="/login" />
}

export default ProtectedRoute