'use client'

import { useState } from 'react'
import { Globe, Lock, Loader2, Sparkles } from 'lucide-react'
import { AppHeader } from '@/components/AppHeader'
import { PhotoUpload } from '@/components/PhotoUpload'
import { AnalysisResults, type Location } from '@/components/AnalysisResults'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

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

  const isAnalyzing = pageState.status === 'analyzing'

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

    setPageState({ status: 'analyzing' })

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageBase64, mimeType: imageMimeType }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Analysis failed')
      setPageState({ status: 'done', locations: data.locations })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis failed'
      setPageState({ status: 'error', message })
    }
  }

  const handleAnalyzeAnother = () => {
    handleClear()
  }

  if (pageState.status === 'done') {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader onHomeClick={handleClear} />
        <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
          <AnalysisResults
            locations={pageState.locations}
            imagePreview={imagePreview}
            imageFileName={imageFileName}
          />
          <Button variant="outline" className="w-full" onClick={handleAnalyzeAnother}>
            Analyze another photo
          </Button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onHomeClick={handleClear} showAiBadge />
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        <div className="text-center space-y-3">
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

        <PhotoUpload
          onImageReady={handleImageReady}
          onClear={handleClear}
          preview={imagePreview}
          fileName={imageFileName}
          disabled={isAnalyzing}
        />

        {pageState.status === 'error' && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {pageState.message}
          </div>
        )}

        <Button
          onClick={handleAnalyze}
          disabled={!imageBase64 || isAnalyzing}
          size="lg"
          className="w-full gap-2 text-base"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Analyzing your photo…
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Analyze photo
            </>
          )}
        </Button>

        {isAnalyzing && (
          <p className="text-sm text-muted-foreground text-center">
            Gemini is scanning for geospatial clues. This can take up to 30 seconds.
          </p>
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
      </main>
    </div>
  )
}
