import { useState } from 'react'
import { useAuth } from '../AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, Loader } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const auth = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (isLogin) {
        await auth.login({ email, password })
      } else {
        await auth.register({ name, email, password })
      }

      // Navigate based on user role
      if (auth.isClient()) {
        navigate('/client/dashboard')
      } else {
        navigate('/clients')
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  function toggleMode() {
    setIsLogin(!isLogin)
    setName('')
    setEmail('')
    setPassword('')
    setError('')
    setShowPassword(false)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-dark">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-20 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 -left-20 w-96 h-96 bg-accent-cyan/20 rounded-full blur-3xl animate-float delay-300" />
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-glow">
              F
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">Freelancerzz</h1>
          <p className="text-dark-muted">
            {isLogin ? 'Welcome back' : 'Join our community'}
          </p>
        </motion.div>

        {/* Card */}
        <motion.div className="glass rounded-2xl p-8 backdrop-blur-xl" variants={itemVariants}>
          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                isLogin
                  ? 'bg-gradient-primary text-white shadow-glow'
                  : 'bg-white/5 text-dark-muted hover:text-dark-text'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                !isLogin
                  ? 'bg-gradient-primary text-white shadow-glow'
                  : 'bg-white/5 text-dark-muted hover:text-dark-text'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            {/* Name field (Register only) */}
            {!isLogin && (
              <motion.div variants={itemVariants}>
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  icon={<User size={18} />}
                  autoComplete="name"
                />
              </motion.div>
            )}

            {/* Email field */}
            <motion.div variants={itemVariants}>
              <Input
                label="Email Address"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={<Mail size={18} />}
                autoComplete="email"
              />
            </motion.div>

            {/* Password field */}
            <motion.div variants={itemVariants}>
              <div className="relative">
                <Input
                  label="Password"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  icon={<Lock size={18} />}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-muted hover:text-dark-text transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            {/* Error message */}
            {error && (
              <motion.div
                className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-300 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.div>
            )}

            {/* Submit button */}
            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
              >
                {isLoading ? (
                  <Loader size={20} className="animate-spin" />
                ) : isLogin ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </Button>
            </motion.div>

            {/* Toggle mode */}
            <motion.div className="text-center text-sm" variants={itemVariants}>
              <p className="text-dark-muted">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
                >
                  {isLogin ? 'Register' : 'Login'}
                </button>
              </p>
            </motion.div>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.p className="text-center text-dark-muted text-sm mt-8" variants={itemVariants}>
          By {isLogin ? 'signing in' : 'registering'}, you agree to our Terms of Service
        </motion.p>
      </motion.div>
    </div>
  )
}


