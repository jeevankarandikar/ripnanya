'use client'

import { useState, useEffect, useRef } from 'react'
import imageCompression from 'browser-image-compression'

interface MediaFile {
  id: string
  url: string
  type: 'image' | 'video'
}

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const [password, setPassword] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [isPasswordVerified, setIsPasswordVerified] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [isClicking, setIsClicking] = useState(false)

  useEffect(() => {
    loadMedia()

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
  }, [])

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

  const handleUploadClick = () => {
    setShowModal(true)
    setPassword('')
    setFile(null)
    setError('')
    setSuccess('')
    setIsPasswordVerified(false)
  }

  const handlePasswordSubmit = () => {
    if (password === 'pig2') {
      setIsPasswordVerified(true)
      setError('')
    } else {
      setError('Incorrect password')
    }
  }

  const compressImage = async (imageFile: File): Promise<File> => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: imageFile.type,
    }

    try {
      const compressedFile = await imageCompression(imageFile, options)
      return compressedFile
    } catch (error) {
      console.error('Compression error:', error)
      return imageFile
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const isImage = selectedFile.type.startsWith('image/')
      const isVideo = selectedFile.type.startsWith('video/')

      if (!isImage && !isVideo) {
        setError('Please select an image or video file')
        setFile(null)
        return
      }

      if (selectedFile.size > 100 * 1024 * 1024) {
        setError('File size must be less than 100MB')
        setFile(null)
        return
      }

      if (isImage) {
        setCompressing(true)
        setError('')
        try {
          const compressed = await compressImage(selectedFile)
          setFile(compressed)
        } catch (error) {
          setError('Error compressing image')
          setFile(null)
        } finally {
          setCompressing(false)
        }
      } else {
        setFile(selectedFile)
      }

      setError('')
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file')
      return
    }

    setIsUploading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Upload successful!')
        setTimeout(() => {
          setShowModal(false)
          loadMedia()
        }, 1500)
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch (error) {
      setError('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action()
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

        <button className="upload-button" onClick={handleUploadClick}>
          + Add Memory
        </button>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Add a Memory</h2>

              {!isPasswordVerified ? (
                <>
                  {error && <div className="error-message">{error}</div>}
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handlePasswordSubmit)}
                  />
                  <div className="modal-buttons">
                    <button className="cancel-button" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button className="submit-button" onClick={handlePasswordSubmit}>
                      Continue
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {error && <div className="error-message">{error}</div>}
                  {success && <div className="success-message">{success}</div>}
                  {compressing && <div className="loading-indicator">Compressing...</div>}

                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    disabled={isUploading || compressing}
                  />

                  {file && (
                    <div className="file-name">
                      Selected: {file.name}
                      <br />
                      Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  )}

                  <div className="modal-buttons">
                    <button
                      className="cancel-button"
                      onClick={() => setShowModal(false)}
                      disabled={isUploading || compressing}
                    >
                      Cancel
                    </button>
                    <button
                      className="submit-button"
                      onClick={handleUpload}
                      disabled={!file || isUploading || compressing}
                    >
                      {isUploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  )
}
