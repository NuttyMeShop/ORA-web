import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { readingsAPI, walletAPI } from '../api/client'
import RitualDeck from '../components/RitualDeck'
import { Axe, SelectedCard, PaywallData, ReadingType } from '../types'

const readingConfigs: Record<string, { name: string; cardCount: number; description: string }> = {
  daily: { name: 'Daily Insight', cardCount: 1, description: 'A single signal to guide your day' },
  yesno: { name: 'Yes / No', cardCount: 3, description: 'Fast clarity for a defined decision' },
  guidance: { name: 'Guidance', cardCount: 3, description: 'Reveal what needs to be understood' },
  path: { name: 'Your Path', cardCount: 7, description: 'Compare two possible directions' },
  deep: { name: 'Deep Reading', cardCount: 10, description: 'Full analysis for complex situations' },
}

export default function Reading() {
  const { type } = useParams<{ type: ReadingType }>()
  const navigate = useNavigate()
  const location = useLocation()
  const config = type ? readingConfigs[type] : null

  const [step, setStep] = useState<'question' | 'axes' | 'ritual' | 'result'>('question')
  const [question, setQuestion] = useState('')
  const [context, setContext] = useState('')
  const [axes, setAxes] = useState<Axe[]>([])
  const [selectedCards, setSelectedCards] = useState<SelectedCard[]>([])
  const [interpretation, setInterpretation] = useState('')
  const [paywall, setPaywall] = useState<PaywallData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [credits, setCredits] = useState(0)

  useEffect(() => {
    // Load user credits
    walletAPI.getStatus().then(data => {
      setCredits(data.credits_remaining || 0)
    }).catch(() => {})
  }, [])

  // Load axes for this reading type
  const loadAxes = async () => {
    if (!type || !question.trim()) return
    
    setLoading(true)
    setError('')
    
    try {
      // For now, use static axes based on reading type
      // In real app, this would call an API to generate axes
      const staticAxes: Record<string, Axe[]> = {
        daily: [{ title: 'The Signal', reason: 'What you need to hear today' }],
        yesno: [
          { title: 'The Situation', reason: 'Current energy around your question' },
          { title: 'The Challenge', reason: 'What blocks or aids the outcome' },
          { title: 'The Outcome', reason: 'Where this is heading' },
        ],
        guidance: [
          { title: 'The Mirror', reason: 'What you are not seeing clearly' },
          { title: 'The Lesson', reason: 'What this situation teaches you' },
          { title: 'The Path', reason: 'How to move forward' },
        ],
        path: [
          { title: 'Your Current State', reason: 'Where you stand now' },
          { title: 'Option A - Short Term', reason: 'Immediate outcome of choice A' },
          { title: 'Option A - Long Term', reason: 'Where A leads over time' },
          { title: 'Option B - Short Term', reason: 'Immediate outcome of choice B' },
          { title: 'Option B - Long Term', reason: 'Where B leads over time' },
          { title: 'Hidden Factor', reason: 'What you are not considering' },
          { title: 'The Wise Choice', reason: 'What serves your highest good' },
        ],
        deep: [
          { title: 'Present Situation', reason: 'Your current circumstances' },
          { title: 'Crossing Influence', reason: 'Immediate challenge or opportunity' },
          { title: 'Root Cause', reason: 'Foundation of the situation' },
          { title: 'Recent Past', reason: 'What has shaped this moment' },
          { title: 'Best Outcome', reason: 'Highest potential available' },
          { title: 'Near Future', reason: 'What is coming next' },
          { title: 'Your Position', reason: 'How you see yourself' },
          { title: 'External Influence', reason: 'How others see the situation' },
          { title: 'Hopes & Fears', reason: 'Your emotional landscape' },
          { title: 'Final Outcome', reason: 'Where this leads if unchanged' },
        ],
      }
      
      setAxes(staticAxes[type] || [])
      setStep('ritual')
    } catch (err: any) {
      setError(err.message || 'Failed to load reading configuration')
    } finally {
      setLoading(false)
    }
  }

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) return
    loadAxes()
  }

  const handleRitualComplete = async (cards: SelectedCard[]) => {
    setSelectedCards(cards)
    setStep('result')
    
    setLoading(true)
    setError('')
    
    try {
      const response = await readingsAPI.generate({
        question,
        context,
        type,
        cards: cards.map((c, i) => ({
          name: c.card.name,
          position: c.positionTitle || `Position ${i + 1}`,
          reversed: c.reversed,
        })),
        language: 'english',
      })
      
      if (response.fullAccess) {
        setInterpretation(response.interpretation)
      } else {
        setPaywall({
          readingId: response.readingId,
          preview: response.preview,
          fullInterpretation: response.interpretation,
          paywall: response.paywall || {
            title: 'Unlock Full Reading',
            subtitle: `${response.cost || 1} credits needed`,
            cost: response.cost || 1,
          },
        })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate reading')
    } finally {
      setLoading(false)
    }
  }

  const handleUnlock = async () => {
    if (!paywall) return
    
    try {
      await walletAPI.spendCredits(paywall.paywall.cost || 1)
      setPaywall(null)
      setInterpretation(paywall.fullInterpretation)
    } catch (err: any) {
      setError(err.message || 'Failed to unlock reading')
    }
  }

  if (!config) {
    return <div className="text-center py-20">Unknown reading type</div>
  }

  // Question step
  if (step === 'question') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-ora-teal">{config.name}</h1>
            <p className="text-gray-600">{config.description}</p>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-500">Credits:</span>
            <span className="ml-2 px-3 py-1 bg-ora-gold/20 text-ora-gold rounded-full font-medium">
              {credits}
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleQuestionSubmit} className="bg-white rounded-xl shadow-sm p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Question
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ora-teal"
              placeholder="What would you like guidance on?"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Context (optional)
            </label>
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
            disabled={loading || !question.trim()}
            className="w-full bg-ora-teal text-white py-3 rounded-lg font-medium hover:bg-opacity-90 disabled:opacity-50"
          >
            {loading ? 'Preparing...' : 'Start Reading'}
          </button>
        </form>
      </div>
    )
  }

  // Ritual step
  if (step === 'ritual') {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-ora-teal mb-2 text-center">{config.name}</h1>
        <p className="text-gray-600 text-center mb-8">{question}</p>
        
        <RitualDeck
          positions={axes}
          onComplete={handleRitualComplete}
          deckType="digital"
        />
      </div>
    )
  }

  // Result step
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-ora-teal mb-8">Your Reading</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-8">
        {/* Question */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Question</h3>
          <p className="text-gray-600">{question}</p>
        </div>

        {/* Cards */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Cards</h3>
          <div className="flex flex-wrap gap-4">
            {selectedCards.map((card, i) => (
              <div
                key={i}
                className={`w-32 h-48 rounded-lg flex flex-col items-center justify-center p-3 text-center
                  ${card.reversed ? 'bg-ora-terracotta/20 border-2 border-ora-terracotta' : 'bg-ora-gold/20 border-2 border-ora-gold'}
                `}
              >
                <span className="text-xs text-gray-500 mb-1">{card.positionTitle}</span>
                <span className="font-medium text-ora-teal">{card.card.name}</span>
                {card.reversed && (
                  <span className="text-xs text-ora-terracotta mt-1">Reversed</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Paywall or Interpretation */}
        {paywall ? (
          <div className="bg-ora-ivory rounded-lg p-6">
            <h3 className="text-xl font-bold text-ora-teal mb-2">{paywall.paywall.title}</h3>
            <p className="text-gray-600 mb-4">{paywall.paywall.subtitle}</p>
            
            <div className="bg-white rounded-lg p-4 mb-4">
              <p className="text-gray-700 italic">{paywall.preview}...</p>
            </div>
            
            <button
              onClick={handleUnlock}
              disabled={credits < (paywall.paywall.cost || 1)}
              className="w-full bg-ora-gold text-white py-3 rounded-lg font-medium hover:bg-opacity-90 disabled:opacity-50"
            >
              {credits < (paywall.paywall.cost || 1) 
                ? 'Not enough credits' 
                : `Unlock for ${paywall.paywall.cost || 1} credits`
              }
            </button>
          </div>
        ) : (
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Interpretation</h3>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ora-teal"></div>
                <span className="ml-3 text-gray-600">Consulting the cards...</span>
              </div>
            ) : (
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {interpretation || 'Your interpretation will appear here...'}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate('/history')}
            className="flex-1 bg-ora-teal text-white py-3 rounded-lg font-medium hover:bg-opacity-90"
          >
            View History
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 border-2 border-ora-teal text-ora-teal py-3 rounded-lg font-medium hover:bg-ora-ivory"
          >
            New Reading
          </button>
        </div>
      </div>
    </div>
  )
}
