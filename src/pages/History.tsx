import { useState, useEffect } from 'react'
import { readingsAPI } from '../api/client'

export default function History() {
  const [readings, setReadings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      const data = await readingsAPI.getHistory()
      setReadings(data.readings || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load history')
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
      <h1 className="text-3xl font-bold text-ora-teal mb-2">Reading History</h1>
      <p className="text-gray-600 mb-8">{readings.length} readings</p>

      {readings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔮</div>
          <p className="text-gray-600">No readings yet. Start your first one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {readings.map((reading) => (
            <div key={reading.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-ora-ivory text-ora-teal rounded-full text-sm font-medium capitalize">
                    {reading.type}
                  </span>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(reading.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-1">Question</h3>
                <p className="text-gray-600">{reading.question}</p>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-1">Cards</h3>
                <div className="flex flex-wrap gap-2">
                  {reading.cards?.map((card: any, i: number) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm">
                      {card.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Interpretation</h3>
                <p className="text-gray-600 line-clamp-3">{reading.interpretation}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
