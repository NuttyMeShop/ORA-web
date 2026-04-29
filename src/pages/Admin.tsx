import { useState, useEffect } from 'react'
import { adminAPI } from '../api/client'

export default function Admin() {
  const [users, setUsers] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [usersData, statsData] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getStats(),
      ])
      setUsers(usersData.users || [])
      setStats(statsData)
    } catch (err: any) {
      setError(err.message || 'Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ora-teal"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-ora-teal mb-8">Admin Dashboard</h1>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl font-bold text-ora-teal">{stats.users?.total || 0}</div>
            <div className="text-gray-600">Total Users</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl font-bold text-ora-teal">{stats.readings?.total || 0}</div>
            <div className="text-gray-600">Total Readings</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl font-bold text-ora-teal">${stats.revenue?.total?.toFixed(2) || '0.00'}</div>
            <div className="text-gray-600">Revenue</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl font-bold text-ora-teal">{stats.credits?.total_issued || 0}</div>
            <div className="text-gray-600">Credits Issued</div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-ora-teal">Users ({users.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Readings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">API Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.plan_type === 'PREMIUM' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.plan_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.credits_remaining}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.total_readings}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">${(user.total_api_cost || 0).toFixed(4)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs bg-gray-100 rounded">{user.language || 'en'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
