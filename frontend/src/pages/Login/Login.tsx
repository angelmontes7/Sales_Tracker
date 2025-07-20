import { useState } from 'react'


function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Username: ', username)
        console.log('Password', password)
        // TODO add login API calls here
    }
    return (
        <div className='main_container'>
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <input 
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
                <button type='submit'> Login </button>
            </form>
        </div>
        
    )
}
export default Login
