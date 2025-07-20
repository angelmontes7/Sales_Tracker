import { useState } from 'react'
import api from "../../api"
import { ACCESS_TOKEN, REFRESH_TOKEN} from '../../constants'
import { useNavigate } from 'react-router-dom'


function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const naviagte = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        e.preventDefault();
        
        try {
            const res = await api.post("/api/token/", {username, password})
            localStorage.setItem(ACCESS_TOKEN, res.data.access)
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
            naviagte("/dashboard")
            
        } catch (error : any) {
            alert(error?.response?.data?.detail || "Login failed!");
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className='main_container'>
            <form onSubmit={handleSubmit} className='form-container'>
                <h2>Login</h2>
                <input
                    className='form-input'
                    type='text'
                    placeholder='username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required>
                </input>
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required>
                </input>
                <button className='form-button' type='submit'> {loading ? "Logging in..." : "Login"} </button>
            </form>
        </div>
        
    )
}
export default Login
