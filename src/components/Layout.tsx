import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const { token, isAdmin, logout } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-ora-ivory">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-ora-teal">
                ORA
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {token ? (
                <>
                  <Link
                    to="/"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/') ? 'text-ora-teal bg-ora-ivory' : 'text-gray-600 hover:text-ora-teal'
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    to="/history"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/history') ? 'text-ora-teal bg-ora-ivory' : 'text-gray-600 hover:text-ora-teal'
                    }`}
                  >
                    History
                  </Link>
                  <Link
                    to="/feedback"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/feedback') ? 'text-ora-teal bg-ora-ivory' : 'text-gray-600 hover:text-ora-teal'
                    }`}
                  >
                    Feedback
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        isActive('/admin') ? 'text-ora-teal bg-ora-ivory' : 'text-gray-600 hover:text-ora-teal'
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="px-3 py-2 rounded-md text-sm font-medium text-ora-terracotta hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-ora-teal"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-md text-sm font-medium bg-ora-teal text-white hover:bg-opacity-90"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
