import { useState } from 'react'
import { feedbackAPI } from '../api/client'

export default function Feedback() {
  const [type, setType] = useState('general')
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await feedbackAPI.submit({ type, message, rating: rating || undefined })
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Failed to submit feedback')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="text-6xl mb-4">🙏</div>
        <h2 className="text-2xl font-bold text-ora-teal mb-4">Thank You!</h2>
        <p className="text-gray-600">Your feedback helps us improve ORA.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-ora-teal mb-2">Send Feedback</h1>
      <p className="text-gray-600 mb-8">Help us improve your experience</p>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Feedback Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ora-teal"
          >
            <option value="general">General Feedback</option>
            <option value="bug">Bug Report</option>
            <option value="feature">Feature Request</option>
            <option value="quality">Reading Quality</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating (optional)</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl ${star <= rating ? 'text-ora-gold' : 'text-gray-300'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ora-teal"
            placeholder="Tell us what you think..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="w-full bg-ora-teal text-white py-3 rounded-lg font-medium hover:bg-opacity-90 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Feedback'}
        </button>
      </form>
    </div>
  )
}
