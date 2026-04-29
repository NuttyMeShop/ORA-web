import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const readingTypes = [
  { id: 'daily', name: 'Daily Insight', description: 'A single signal to guide your day', icon: '☀️' },
  { id: 'yesno', name: 'Yes / No', description: 'Fast clarity for a defined decision', icon: '⚡' },
  { id: 'guidance', name: 'Guidance', description: 'Reveal what needs to be understood', icon: '🔮' },
  { id: 'path', name: 'Your Path', description: 'Compare two possible directions', icon: '🛤️' },
  { id: 'deep', name: 'Deep Reading', description: 'Full analysis for complex situations', icon: '🌊' },
]

export default function Home() {
  const { token } = useAuth()

  if (!token) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-ora-teal mb-4">
          Decision Intelligence
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Transform uncertainty into clarity through structured reflection.
          Your personal tarot guide for better decisions.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/register"
            className="px-8 py-3 bg-ora-teal text-white rounded-lg font-medium hover:bg-opacity-90"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 border-2 border-ora-teal text-ora-teal rounded-lg font-medium hover:bg-ora-ivory"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-ora-teal mb-2">Choose your focus</h1>
      <p className="text-gray-600 mb-8">Select a reading type that matches your current situation</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {readingTypes.map((type) => (
          <Link
            key={type.id}
            to={`/reading/${type.id}`}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="text-4xl mb-4">{type.icon}</div>
            <h3 className="text-xl font-semibold text-ora-teal mb-2">{type.name}</h3>
            <p className="text-gray-600 text-sm">{type.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
