'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

const STEPS = [
  'Scanning architecture and landmarks…',
  'Reading vegetation and climate cues…',
  'Matching geographic patterns…',
  'Ranking likely locations…',
]

export function AnalyzingStatus() {
  const [stepIndex, setStepIndex] = useState(0)
  const [progress, setProgress] = useState(8)

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStepIndex((i) => (i + 1) % STEPS.length)
    }, 2800)
    return () => clearInterval(stepTimer)
  }, [])

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((p) => {
        if (p >= 92) return 12
        return p + Math.random() * 10 + 4
      })
    }, 900)
    return () => clearInterval(progressTimer)
  }, [])

  return (
    <div className="space-y-3 animate-fade-in-up">
      <Progress value={progress} className="h-1.5" />
      <p
        key={stepIndex}
        className="flex items-center justify-center gap-2 text-sm text-muted-foreground animate-fade-in-up"
      >
        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
        {STEPS[stepIndex]}
      </p>
    </div>
  )
}
