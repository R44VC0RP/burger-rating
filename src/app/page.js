'use client'

import { useState, useRef, useEffect } from 'react'
import { FaUpload } from 'react-icons/fa'
import { FaBurger } from 'react-icons/fa6'
import { rateBurger } from './actions'

export default function Home() {
  const [rating, setRating] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => {
      window.removeEventListener('resize', checkMobile)
      // Cleanup preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const getRatingColor = (percentage) => {
    if (percentage >= 80) return 'text-green-500'
    if (percentage >= 60) return 'text-emerald-500'
    if (percentage >= 40) return 'text-yellow-500'
    if (percentage >= 20) return 'text-orange-500'
    return 'text-red-500'
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      // Cleanup old preview
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      // Create new preview
      setPreviewUrl(URL.createObjectURL(file))
      setIsLoading(true)
      setRating(null)
      
      const formData = new FormData()
      formData.append('image', file)
      const result = await rateBurger(formData)
      setRating(result)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-purple-500 text-white text-center py-2 text-sm">
        <a 
          href="https://x.com/i/communities/1875485031298469891" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:underline inline-flex items-center gap-2"
        >
          Official website of the X Burger Posting Community 
          <span className="text-xs">↗</span>
        </a>
      </div>
      
      <div className="p-8">
        <main className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
              <FaBurger className="text-yellow-600" />
              Burger Ratings
            </h1>
            <p className="text-gray-600">
              {isMobile 
                ? "Take a photo or choose from your library to rate your burger!"
                : "Upload a photo of your burger for an instant rating!"}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="space-y-4">
              <button
                onClick={() => fileInputRef.current.click()}
                className="flex items-center justify-center gap-2 bg-purple-500 text-white px-6 py-4 rounded-lg hover:bg-purple-600 transition-colors w-full"
              >
                <FaUpload />
                {isMobile ? 'Take Photo or Choose from Library' : 'Upload Photo'}
              </button>
              <input
                type="file"
                accept="image/*"
                capture={isMobile ? 'environment' : undefined}
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
            </div>
          </div>

          {previewUrl && (
            <div className="relative mb-8 rounded-xl overflow-hidden">
              <img 
                src={previewUrl} 
                alt="Uploaded burger" 
                className="w-full h-[300px] object-cover"
              />
              {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50">
                  <div className="absolute inset-0 animate-scan">
                    <div className="h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent w-full" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white text-lg font-semibold">Analyzing burger...</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {rating && !isLoading && (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">Burger Rating</h2>
                <div className={`text-6xl font-bold ${getRatingColor(rating.rating)}`}>
                  {rating.rating}%
                </div>
                <p className="text-gray-600 mt-2">Juiciness Score</p>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Analysis:</h3>
                <p className="text-gray-700 leading-relaxed">
                  {rating.comments}
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}