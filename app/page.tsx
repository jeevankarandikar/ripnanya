'use client'

import { useState, useEffect, useRef } from 'react'

interface MediaFile {
  id: string
  url: string
  type: 'image' | 'video'
}

export default function Home() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const cursorRef = useRef<HTMLDivElement>(null)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [isClicking, setIsClicking] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      loadMedia()
    }

    // Custom cursor tracking
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY })
    }

    const handleMouseDown = () => {
      setIsClicking(true)
    }

    const handleMouseUp = () => {
      setIsClicking(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isAuthenticated])

  const loadMedia = async () => {
    try {
      const response = await fetch('/api/media')
      if (response.ok) {
        const data = await response.json()
        setMediaFiles(data.files || [])
      }
    } catch (error) {
      console.error('Error loading media:', error)
    }
  }

  const handlePasswordSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (password === 'pig2') {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Incorrect password')
      setPassword('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit()
    }
  }

  const handleVideoHover = (e: React.MouseEvent<HTMLDivElement>, isHovering: boolean) => {
    const video = e.currentTarget.querySelector('video')
    if (video) {
      if (isHovering) {
        video.muted = false
        video.play().catch(() => {
          // If autoplay with sound fails, try muted
          video.muted = true
          video.play()
        })
      } else {
        video.pause()
        video.currentTime = 0
        video.muted = true
      }
    }
  }

  const handleVideoTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    const video = e.currentTarget.querySelector('video')
    if (video) {
      if (video.paused) {
        video.muted = false
        video.play().catch(() => {
          video.muted = true
          video.play()
        })
      } else {
        video.pause()
      }
    }
  }

  // Show password gate if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        {/* Custom Cursor */}
        <div
          ref={cursorRef}
          className={`custom-cursor ${isClicking ? 'clicking' : ''}`}
          style={{
            left: `${cursorPos.x}px`,
            top: `${cursorPos.y}px`,
          }}
        />

        <div className="clouds-background">
          <div className="cloud cloud-1"></div>
          <div className="cloud cloud-2"></div>
          <div className="cloud cloud-3"></div>
          <div className="cloud cloud-4"></div>
          <div className="cloud cloud-5"></div>
        </div>

        <main className="main-container">
          <div className="age-gate">
            <div className="age-gate-content">
              <div className="warning-icon">⚠️</div>
              <h1>WARNING</h1>
              <h2>YOU MUST BE 18 YEARS OR OLDER TO ENTER</h2>
              <p>This site contains memories that may be too emotional for younger viewers.</p>
              <p className="blink">Enter at your own risk</p>

              <div className="password-section">
                {error && <div className="error-message">{error}</div>}
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  autoFocus
                />
                <button onClick={() => handlePasswordSubmit()} className="enter-button">
                  ENTER SITE
                </button>
              </div>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className={`custom-cursor ${isClicking ? 'clicking' : ''}`}
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
        }}
      />

      <div className="clouds-background">
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
        <div className="cloud cloud-4"></div>
        <div className="cloud cloud-5"></div>
      </div>

      <main className="main-container">
        <div className="media-grid">
          {mediaFiles.map((media) => (
            <div
              key={media.id}
              className="media-item"
              onMouseEnter={(e) => media.type === 'video' && handleVideoHover(e, true)}
              onMouseLeave={(e) => media.type === 'video' && handleVideoHover(e, false)}
              onTouchStart={(e) => media.type === 'video' && handleVideoTouch(e)}
            >
              {media.type === 'image' ? (
                <img src={media.url} alt="Memory" />
              ) : (
                <video
                  src={media.url}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
              )}
            </div>
          ))}
        </div>

      </main>
    </>
  )
}
