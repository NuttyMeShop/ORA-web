import { useState, useEffect } from 'react'

export default function Profile() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load profile from API - TODO: implement
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ora-teal"></div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-ora-teal mb-8">Your Profile</h1>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-ora-teal rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl">
            👤
          </div>
          <h2 className="text-xl font-semibold">Profile</h2>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Name</span>
            <span className="font-medium">User</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Email</span>
            <span className="font-medium">user@example.com</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Plan</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Free</span>
          </div>
        </div>
      </div>
    </div>
  )
}
