import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { walletAPI, userAPI } from '../api/client'
import { PsychProfile } from '../types'

export default function Preferences() {
  const [profile, setProfile] = useState<{
    email: string
    name: string
    plan: string
    credits: number
    language: string
  } | null>(null)
  const [psychProfile, setPsychProfile] = useState<PsychProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const [walletData, psychData] = await Promise.all([
        walletAPI.getStatus(),
        userAPI.getPsychProfile().catch(() => null), // Graceful fallback
      ])
      
      setProfile({
        email: walletData.email || 'user@example.com',
        name: walletData.name || 'User',
        plan: walletData.plan || 'FREE',
        credits: walletData.credits || 0,
        language: walletData.language || 'en',
      })
      
      // Use real psych profile from backend if available
      if (psychData?.profile) {
        setPsychProfile(psychData.profile)
      } else {
        // Fallback mock for demo
        setPsychProfile({
          fear: 'instability',
          pattern: 'overthinking',
          value: 'growth',
          risk: 'medium',
          focus: 'career',
        })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const psychLabels: Record<string, Record<string, string>> = {
    fear: {
      instability: 'Fear of Instability',
      rejection: 'Fear of Rejection',
      failure: 'Fear of Failure',
      unknown: 'Fear of the Unknown',
    },
    pattern: {
      overthinking: 'Overthinking',
      avoidant: 'Avoidant',
      impulsive: 'Impulsive',
      perfectionist: 'Perfectionist',
    },
    value: {
      growth: 'Personal Growth',
      harmony: 'Harmony',
      success: 'Success',
      freedom: 'Freedom',
    },
    risk: {
      low: 'Risk Averse',
      medium: 'Balanced',
      high: 'Risk Taker',
    },
    focus: {
      career: 'Career',
      relationships: 'Relationships',
      health: 'Health',
      spirituality: 'Spirituality',
    },
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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-ora-teal mb-8">Preferences</h1>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-ora-teal rounded-full flex items-center justify-center text-white text-2xl">
              👤
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-ora-teal">{profile?.name}</h2>
              <p className="text-gray-600">{profile?.email}</p>
            </div>
          </div>
          <Link
            to="/profile"
            className="px-4 py-2 text-ora-teal border border-ora-teal rounded-lg hover:bg-ora-ivory"
          >
            Edit
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-ora-ivory rounded-lg p-4">
            <p className="text-sm text-gray-600">Plan</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              profile?.plan === 'PREMIUM' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {profile?.plan}
            </span>
          </div>
          <div className="bg-ora-ivory rounded-lg p-4">
            <p className="text-sm text-gray-600">Credits</p>
            <p className="text-2xl font-bold text-ora-gold">{profile?.credits}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button className="flex-1 bg-ora-gold text-white py-2 rounded-lg font-medium hover:bg-opacity-90">
            Buy Credits
          </button>
          <button className="flex-1 bg-ora-teal text-white py-2 rounded-lg font-medium hover:bg-opacity-90">
            Upgrade
          </button>
        </div>
      </div>

      {/* Psych Profile */}
      {psychProfile && (
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <h2 className="text-xl font-semibold text-ora-teal mb-4">Energetic Signature</h2>
          
          <div className="space-y-4">
            {Object.entries(psychProfile).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                <span className="text-gray-600 capitalize">{key}</span>
                <span className="font-medium text-ora-teal">
                  {psychLabels[key]?.[value] || value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Language */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-xl font-semibold text-ora-teal mb-4">Language</h2>
        <select
          value={profile?.language}
          onChange={(e) => {/* TODO: update language */}}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ora-teal"
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="es">Español</option>
          <option value="de">Deutsch</option>
          <option value="it">Italiano</option>
          <option value="pt">Português</option>
          <option value="ja">日本語</option>
        </select>
      </div>
    </div>
  )
}
