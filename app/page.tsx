'use client'

import { useEffect, useRef, useState } from 'react'
import { Globe, Lock, Sparkles } from 'lucide-react'
import { AppHeader } from '@/components/AppHeader'
import { AnalyzingStatus } from '@/components/AnalyzingStatus'
import { PhotoUpload } from '@/components/PhotoUpload'
import { ImagePreview } from '@/components/ImagePreview'
import { AnalysisResults, type Location } from '@/components/AnalysisResults'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type PageState =
  | { status: 'idle' }
  | { status: 'analyzing' }
  | { status: 'done'; locations: Location[] }
  | { status: 'error'; message: string }

export default function HomePage() {
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFileName, setImageFileName] = useState<string | null>(null)
  const [pageState, setPageState] = useState<PageState>({ status: 'idle' })
  const analysisAbortRef = useRef<AbortController | null>(null)
  const analysisRequestIdRef = useRef(0)

  const isAnalyzing = pageState.status === 'analyzing'
  const isDone = pageState.status === 'done'
  const showUploadUI = !isAnalyzing && !isDone

  useEffect(() => {
    if (isDone) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [isDone])

  useEffect(() => {
    return () => {
      analysisAbortRef.current?.abort()
    }
  }, [])

  const cancelAnalysis = () => {
    analysisAbortRef.current?.abort()
    analysisAbortRef.current = null
    analysisRequestIdRef.current += 1
  }

  const isAbortError = (err: unknown) =>
    err instanceof DOMException && err.name === 'AbortError'

  const handleImageReady = (base64: string, mimeType: string, preview: string, fileName: string) => {
    setImageBase64(base64)
    setImageMimeType(mimeType)
    setImagePreview(preview)
    setImageFileName(fileName)
    if (pageState.status === 'error') {
      setPageState({ status: 'idle' })
    }
  }

  const handleClear = () => {
    cancelAnalysis()
    setImageBase64(null)
    setImageMimeType('image/jpeg')
    setImagePreview(null)
    setImageFileName(null)
    setPageState({ status: 'idle' })
  }

  const handleAnalyze = async () => {
    if (!imageBase64) {
      setPageState({ status: 'error', message: 'Please upload a photo first.' })
      return
    }

    cancelAnalysis()
    const controller = new AbortController()
    analysisAbortRef.current = controller
    const requestId = analysisRequestIdRef.current

    setPageState({ status: 'analyzing' })

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageBase64, mimeType: imageMimeType }),
        signal: controller.signal,
      })
      if (requestId !== analysisRequestIdRef.current) return

      const data = await res.json()
      if (requestId !== analysisRequestIdRef.current) return
      if (!res.ok) throw new Error(data.error ?? 'Analysis failed')
      setPageState({ status: 'done', locations: data.locations })
    } catch (err) {
      if (requestId !== analysisRequestIdRef.current || isAbortError(err)) return
      const message = err instanceof Error ? err.message : 'Analysis failed'
      setPageState({ status: 'error', message })
    } finally {
      if (analysisAbortRef.current === controller) {
        analysisAbortRef.current = null
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onHomeClick={handleClear} showAiBadge={showUploadUI} />

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        <div
          className={cn(
            'text-center space-y-3 transition-all duration-300 ease-in-out',
            showUploadUI
              ? 'opacity-100 max-h-64 overflow-visible'
              : 'opacity-0 max-h-0 overflow-hidden pointer-events-none'
          )}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Globe className="h-4 w-4" />
            Geospatial Intelligence
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Where was this photo taken?
          </h1>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Upload any photo and our AI analyst identifies the top 3 most likely locations using
            architecture, vegetation, infrastructure, text, and climate cues.
          </p>
        </div>

        {imagePreview ? (
          <div className="space-y-4">
            <ImagePreview
              src={imagePreview}
              alt={isDone ? 'Analyzed photo' : 'Uploaded photo'}
              fileName={imageFileName}
              size={isDone ? 'sm' : 'md'}
              analyzing={isAnalyzing}
              onClear={showUploadUI ? handleClear : undefined}
            />
            {isAnalyzing && <AnalyzingStatus />}
          </div>
        ) : (
          <PhotoUpload onImageReady={handleImageReady} disabled={isAnalyzing} />
        )}

        {showUploadUI && (
          <>
            {pageState.status === 'error' && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive animate-fade-in-up">
                {pageState.message}
              </div>
            )}

            {imagePreview && (
              <Button
                onClick={handleAnalyze}
                disabled={!imageBase64}
                size="lg"
                className="w-full gap-2 text-base"
              >
                <Sparkles className="h-5 w-5" />
                Analyze photo
              </Button>
            )}

            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { icon: Lock, title: 'Private', desc: 'Images never stored on our servers' },
                { icon: Sparkles, title: 'Fast results', desc: 'Analysis in seconds' },
                { icon: Globe, title: 'Powered by Gemini', desc: 'Google Gemini 3.1 Flash Lite Preview' },
              ].map(({ icon: Icon, title, desc }) => (
                <Card key={title} className="bg-muted/30">
                  <CardContent className="p-4 space-y-1">
                    <Icon className="h-5 w-5 mx-auto text-muted-foreground" />
                    <p className="text-xs font-semibold">{title}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {isDone && (
          <div className="space-y-8">
            <AnalysisResults locations={pageState.locations} />
            <Button
              variant="outline"
              className="w-full animate-fade-in-up"
              style={{ animationDelay: '500ms' }}
              onClick={handleClear}
            >
              Analyze another photo
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
