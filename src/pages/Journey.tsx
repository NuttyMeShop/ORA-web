import { useState, useEffect } from 'react'
import { readingsAPI, lifeMapAPI } from '../api/client'
import { MemoryPattern } from '../types'

export default function Journey() {
  const [patterns, setPatterns] = useState<MemoryPattern[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadJourneyData()
  }, [])

  const loadJourneyData = async () => {
    try {
      // Try to get real analysis from backend
      const [lifeMapData, historyData] = await Promise.all([
        lifeMapAPI.getAnalysis().catch(() => null),
        readingsAPI.getHistory(),
      ])
      
      const readings = historyData.readings || []
      
      // Use backend analysis if available, otherwise calculate locally
      if (lifeMapData?.patterns) {
        setPatterns(lifeMapData.patterns.map((p: any) => ({
          type: p.type,
          description: p.description,
          frequency: p.frequency || 1,
        })))
      } else {
        // Fallback: calculate patterns from history
        const calculatedPatterns = calculatePatterns(readings)
        setPatterns(calculatedPatterns)
      }
      
      setStats({
        totalReadings: readings.length,
        mostCommonType: getMostCommonType(readings),
        streak: calculateStreak(readings),
      })
    } catch (err: any) {
      setError(err.message || 'Failed to load journey data')
    } finally {
      setLoading(false)
    }
  }

  const calculatePatterns = (readings: any[]): MemoryPattern[] => {
    // Simple pattern detection based on reading types and themes
    const patterns: MemoryPattern[] = []
    
    const typeCounts: Record<string, number> = {}
    readings.forEach(r => {
      typeCounts[r.type] = (typeCounts[r.type] || 0) + 1
    })
    
    if (typeCounts['yesno'] > 3) {
      patterns.push({
        type: 'decision_focused',
        description: 'You often seek clarity on specific choices',
        frequency: typeCounts['yesno'],
      })
    }
    
    if (typeCounts['deep'] > 2) {
      patterns.push({
        type: 'depth_seeker',
        description: 'You prefer deep, comprehensive readings',
        frequency: typeCounts['deep'],
      })
    }
    
    if (typeCounts['daily'] > 5) {
      patterns.push({
        type: 'daily_ritual',
        description: 'You use tarot as a daily practice',
        frequency: typeCounts['daily'],
      })
    }
    
    return patterns
  }

  const getMostCommonType = (readings: any[]): string => {
    const counts: Record<string, number> = {}
    readings.forEach(r => {
      counts[r.type] = (counts[r.type] || 0) + 1
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'none'
  }

  const calculateStreak = (readings: any[]): number => {
    if (readings.length === 0) return 0
    // Simplified streak calculation
    return Math.min(readings.length, 7)
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
      <h1 className="text-3xl font-bold text-ora-teal mb-2">Your Journey</h1>
      <p className="text-gray-600 mb-8">Discover patterns in your readings</p>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl font-bold text-ora-teal">{stats.totalReadings}</div>
            <div className="text-gray-600">Total Readings</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl font-bold text-ora-teal capitalize">{stats.mostCommonType}</div>
            <div className="text-gray-600">Favorite Type</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl font-bold text-ora-teal">{stats.streak}</div>
            <div className="text-gray-600">Day Streak</div>
          </div>
        </div>
      )}

      {/* Patterns */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-xl font-semibold text-ora-teal mb-6">Your Patterns</h2>
        
        {patterns.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🔮</div>
            <p className="text-gray-600">Complete more readings to discover your patterns</p>
          </div>
        ) : (
          <div className="space-y-4">
            {patterns.map((pattern, i) => (
              <div key={i} className="bg-ora-ivory rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-ora-teal capitalize">
                      {pattern.type.replace(/_/g, ' ')}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">{pattern.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-ora-gold/20 text-ora-gold rounded-full text-sm">
                    {pattern.frequency}x
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
