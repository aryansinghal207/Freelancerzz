import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthContext'

const RequireAuth = ({ children }) => {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to={{ pathname: '/login', state: { from: location } }} replace />
  }

  return children
}

export default RequireAuth