import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { readingsAPI } from '../api/client'

const cardNames = [
  'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
  'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit',
  'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
  'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun',
  'Judgement', 'The World'
]

export default function Reading() {
  const { type } = useParams<{ type: string }>()
  const navigate = useNavigate()
  const [step, setStep] = useState<'question' | 'cards' | 'result'>('question')
  const [question, setQuestion] = useState('')
  const [context, setContext] = useState('')
  const [selectedCards, setSelectedCards] = useState<string[]>([])
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const cardCount = type === 'daily' ? 1 : type === 'yesno' ? 3 : type === 'guidance' ? 3 : type === 'path' ? 7 : 10

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return
    setStep('cards')
  }

  const handleSelectCard = (card: string) => {
    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter(c => c !== card))
    } else if (selectedCards.length < cardCount) {
      setSelectedCards([...selectedCards, card])
    }
  }

  const handleSubmitReading = async () => {
    if (selectedCards.length !== cardCount) return

    setLoading(true)
    setError('')

    try {
      const response = await readingsAPI.generate({
        question,
        context,
        type,
        cards: selectedCards.map((name, i) => ({
          name,
          position: `Position ${i + 1}`
        })),
        language: 'english'
      })
      setResult(response)
      setStep('result')
    } catch (err: any) {
      setError(err.message || 'Failed to generate reading')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'question') {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-ora-teal mb-2 capitalize">{type} Reading</h1>
        <p className="text-gray-600 mb-8">What would you like guidance on?</p>

        <form onSubmit={handleSubmitQuestion} className="bg-white rounded-xl shadow-sm p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ora-teal"
              placeholder="e.g., Should I accept this job offer?"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Context (optional)</label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ora-teal"
              placeholder="Any additional context..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-ora-teal text-white py-3 rounded-lg font-medium hover:bg-opacity-90"
          >
            Continue
          </button>
        </form>
      </div>
    )
  }

  if (step === 'cards') {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-ora-teal mb-2">Select {cardCount} Cards</h1>
        <p className="text-gray-600 mb-4">Selected: {selectedCards.length}/{cardCount}</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mb-8">
          {cardNames.map((card) => (
            <button
              key={card}
              onClick={() => handleSelectCard(card)}
              disabled={!selectedCards.includes(card) && selectedCards.length >= cardCount}
              className={`p-4 rounded-lg border-2 text-sm font-medium transition-all ${
                selectedCards.includes(card)
                  ? 'border-ora-teal bg-ora-teal text-white'
                  : selectedCards.length >= cardCount
                  ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 text-gray-700 hover:border-ora-teal'
              }`}
            >
              {card}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmitReading}
          disabled={selectedCards.length !== cardCount || loading}
          className="w-full bg-ora-teal text-white py-3 rounded-lg font-medium hover:bg-opacity-90 disabled:opacity-50"
        >
          {loading ? 'Generating reading...' : 'Get Reading'}
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-ora-teal mb-8">Your Reading</h1>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Question</h3>
          <p className="text-gray-600">{question}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Cards</h3>
          <div className="flex flex-wrap gap-2">
            {selectedCards.map((card, i) => (
              <span key={i} className="px-3 py-1 bg-ora-ivory text-ora-teal rounded-full text-sm">
                {card}
              </span>
            ))}
          </div>
        </div>

        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Interpretation</h3>
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {result?.interpretation || 'No interpretation available'}
          </div>
        </div>

        <button
          onClick={() => navigate('/history')}
          className="mt-8 w-full bg-ora-gold text-white py-3 rounded-lg font-medium hover:bg-opacity-90"
        >
          View in History
        </button>
      </div>
    </div>
  )
}
