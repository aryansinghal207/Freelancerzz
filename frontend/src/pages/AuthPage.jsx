import { useState } from 'react'
import { useAuth } from '../AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const auth = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      if (isLogin) await auth.login({ email, password })
      else await auth.register({ name, email, password })
      navigate('/clients')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed')
    }
  }

  function toggleMode() {
    setIsLogin(!isLogin)
    // Clear fields to avoid browser reusing the last values on the other form
    setName('')
    setEmail('')
    setPassword('')
    setError('')
  }

  return (
    <div style={{ maxWidth: 360, margin: '48px auto' }}>
      <h2 style={{ marginBottom: 16 }}>{isLogin ? 'Login' : 'Register'}</h2>
      {/* key forces a remount when switching between login/register, which helps prevent autofill bleed-through */}
      {/* Prevent aggressive browser autofill on initial render */}
      <form key={isLogin ? 'login' : 'register'} onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }} autoComplete="off">
        {/* Decoy fields absorb password managers' autofill */}
        <input style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }} type="text" name="fake-username" autoComplete="username" tabIndex={-1} aria-hidden="true" />
        <input style={{ position: 'absolute', opacity: 0, height: 0, width: 0, pointerEvents: 'none' }} type="password" name="fake-password" autoComplete="current-password" tabIndex={-1} aria-hidden="true" />
        {!isLogin && (
          <input
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            name="name"
            autoComplete="name"
            inputMode="text"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
        )}
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
          required
          name="email"
          autoComplete="off"
          inputMode="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          onFocus={e => e.currentTarget.setAttribute('autocomplete', 'username')}
        />
        <input
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          required
          name="password"
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          onFocus={e => e.currentTarget.setAttribute('autocomplete', isLogin ? 'current-password' : 'new-password')}
        />
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">{isLogin ? 'Login' : 'Create Account'}</button>
      </form>
      <button style={{ marginTop: 8 }} onClick={toggleMode}>
        {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
      </button>
    </div>
  )
}


