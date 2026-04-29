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
            
            <div className="flex items-center space-x-2 md:space-x-4">
              {token ? (
                <>
                  <Link
                    to="/"
                    className={`px-2 md:px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/') ? 'text-ora-teal bg-ora-ivory' : 'text-gray-600 hover:text-ora-teal'
                    }`}
                  >
                    <span className="hidden md:inline">Readings</span>
                    <span className="md:hidden">🏠</span>
                  </Link>
                  <Link
                    to="/journey"
                    className={`px-2 md:px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/journey') ? 'text-ora-teal bg-ora-ivory' : 'text-gray-600 hover:text-ora-teal'
                    }`}
                  >
                    <span className="hidden md:inline">Journey</span>
                    <span className="md:hidden">🛤️</span>
                  </Link>
                  <Link
                    to="/history"
                    className={`px-2 md:px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/history') ? 'text-ora-teal bg-ora-ivory' : 'text-gray-600 hover:text-ora-teal'
                    }`}
                  >
                    <span className="hidden md:inline">History</span>
                    <span className="md:hidden">📜</span>
                  </Link>
                  <Link
                    to="/preferences"
                    className={`px-2 md:px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/preferences') ? 'text-ora-teal bg-ora-ivory' : 'text-gray-600 hover:text-ora-teal'
                    }`}
                  >
                    <span className="hidden md:inline">Settings</span>
                    <span className="md:hidden">⚙️</span>
                  </Link>
                  <Link
                    to="/feedback"
                    className={`px-2 md:px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/feedback') ? 'text-ora-teal bg-ora-ivory' : 'text-gray-600 hover:text-ora-teal'
                    }`}
                  >
                    <span className="hidden md:inline">Feedback</span>
                    <span className="md:hidden">💬</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className={`px-2 md:px-3 py-2 rounded-md text-sm font-medium ${
                        isActive('/admin') ? 'text-ora-teal bg-ora-ivory' : 'text-gray-600 hover:text-ora-teal'
                      }`}
                    >
                      <span className="hidden md:inline">Admin</span>
                      <span className="md:hidden">🔒</span>
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="px-2 md:px-3 py-2 rounded-md text-sm font-medium text-ora-terracotta hover:bg-red-50"
                  >
                    <span className="hidden md:inline">Logout</span>
                    <span className="md:hidden">🚪</span>
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
